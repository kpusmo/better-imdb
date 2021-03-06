import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection, SelectQueryBuilder} from 'typeorm';
import {DatatableTransferObject} from '../transfer-objects/DatatableTransferObject';
import {DatatableResult} from '../types/DatatableResult';

@Injectable()
export class DatatableService<Entity> {
    private queryBuilder: SelectQueryBuilder<Entity>;
    private dto: DatatableTransferObject;

    constructor(
        @InjectConnection() private readonly connection: Connection,
    ) {
    }

    async get(dto: DatatableTransferObject): Promise<DatatableResult<Entity>> {
        this.dto = dto;
        this.queryBuilder = this
            .connection
            .createQueryBuilder()
            .select(dto.table)
            .from(dto.table, dto.table);
        this
            .buildRelations()
            .buildSort();
        const total = await this.getCount();
        this.buildPagination();
        return {
            data: await this.getData(),
            total,
            page: dto.page,
            perPage: dto.perPage,
        };
    }

    private buildRelations(): DatatableService<Entity> {
        if (!this.dto.relations || !this.dto.relations.length) {
            return this;
        }
        for (const relation of this.dto.relations) {
            this.queryBuilder.leftJoinAndSelect(relation, this.getAliasFromPath(relation));
        }
        return this;
    }

    private buildSort(): DatatableService<Entity> {
        if (!this.dto.sort) {
            return this;
        }
        const chunks = this.dto.sort.split('|');
        const direction = chunks[1].toUpperCase();
        if (chunks.length !== 2 || ['ASC', 'DESC'].indexOf(direction) === -1) {
            throw new BadRequestException('[Datatable] Malformed sort parameter provided');
        }
        this.queryBuilder.orderBy(chunks[0], direction as 'ASC' | 'DESC');
        return this;
    }

    private async getCount(): Promise<number> {
        return await this.queryBuilder.getCount();
    }

    private buildPagination(): DatatableService<Entity> {
        const perPageAsNumber = parseInt(this.dto.perPage as string, 10);
        if (!Number.isInteger(perPageAsNumber)) {
            return this;
        }
        // this is workaround for TypeORM bug. refer to https://github.com/typeorm/typeorm/issues/5670
        this.queryBuilder.select(`${this.dto.table}.id`).distinct(true);
        this.queryBuilder.limit(perPageAsNumber);
        if (+this.dto.page) {
            // page is indexed from 1 in this.dto and OFFSET is indexed from 0 in MariaDB
            const offset = (this.dto.page - 1) * perPageAsNumber;
            this.queryBuilder.offset(offset);
        }
        const innerSql = `(${this.queryBuilder.getSql()})`;
        this.queryBuilder = this
            .connection
            .createQueryBuilder()
            .select(this.dto.table)
            .from(this.dto.table, this.dto.table)
            .innerJoin(innerSql, 'filteredEntities', `filteredEntities.${this.dto.table}_id = ${this.dto.table}.id`) as SelectQueryBuilder<Entity>;
        this
            .buildRelations()
            .buildSort();

        return this;
    }

    private getData(): Promise<Entity[]> {
        return this.queryBuilder.getMany();
    }

    private getAliasFromPath(relation: string): string {
        const chunks = relation.split('.');
        return chunks.pop();
    }
}
