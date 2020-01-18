import {Role} from '../../authorization/models/Role';

export default interface AuthUser {
    userId: number;
    roles: Role[];
}
