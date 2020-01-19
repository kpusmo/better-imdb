import {Repository} from 'typeorm';
import {User} from '../modules/user/models/User';
import * as faker from 'faker';
import {AuthGuard} from '@nestjs/passport';

export const createUser = (repository: Repository<User>, options?: Partial<User>, passwordHashFunction?: (s) => string) => {
    const user = new User();
    user.email = faker.internet.email();
    user.password = 'test';
    user.fullName = faker.name.findName();
    fill(user, options);
    if (passwordHashFunction) {
        user.password = passwordHashFunction(user.password);
    }
    return repository.save(user);
};

const fill = (entity, options) => {
    for (const [field, value] of Object.entries(options || {})) {
        if (entity[field] !== undefined) {
            entity[field] = value;
        }
    }
};

export class AuthGuardFactory {
    private user;
    private doActivate: boolean;
    private fake: boolean = true;

    setUser(user) {
        this.user = user;
    }

    setActivation(doActivate) {
        this.doActivate = doActivate;
    }

    setFaking(fake) {
        this.fake = fake;
    }

    getGuard(strategy?: string) {
        if (!strategy) {
            strategy = 'jwt';
        }
        return {
            canActivate: ctx => {
                if (!this.fake) {
                    const originalAuthGuard = new (AuthGuard(strategy))();
                    return originalAuthGuard.canActivate(ctx);
                }
                console.log('AuthGuard fake - authenticated: ', this.doActivate);
                ctx.switchToHttp().getRequest().user = this.user;
                return this.doActivate;
            },
        };
    }
}
