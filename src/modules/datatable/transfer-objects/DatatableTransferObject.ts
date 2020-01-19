import {IsOptional} from 'class-validator';

export class DatatableTransferObject {
    table: string;

    relations: string[];

    @IsOptional()
    perPage: number | 'ALL';

    @IsOptional()
    page: number;

    @IsOptional()
    sort: string;

    public constructor(init?: Partial<DatatableTransferObject>) {
        Object.assign(this, this.defaults);
        Object.assign(this, init);
    }

    private get defaults() {
        return {
            perPage: 10,
            page: 1,
            relations: [],
        };
    }
}
