export interface DatatableResult<Entity> {
    data: Entity[];
    page: number;
    perPage: number | 'ALL';
    total: number;
}
