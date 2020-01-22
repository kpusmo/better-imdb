import {Repository} from 'typeorm';
import {User} from '../modules/user/models/User';
import * as faker from 'faker';
import {AuthGuard} from '@nestjs/passport';
import {Movie} from '../modules/movie/models/Movie';

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

export const createMovie = (repository: Repository<Movie>, options?: Partial<Movie>) => {
    const movie = new Movie();
    movie.name = faker.random.words(3);
    movie.description = faker.random.words(15);
    movie.metascore = faker.random.number({max: 99, min: 10, precision: 4});
    movie.posterPath = faker.system.commonFileName();
    const premiereDate = faker.date.between('01-01-1800', '01-01-2100');
    premiereDate.setHours(0, 0, 0, 0);
    movie.premiereDate = premiereDate;
    fill(movie, options);
    return repository.save(movie);
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
                // tslint:disable-next-line:no-console
                console.log('AuthGuard fake - authenticated: ', this.doActivate);
                ctx.switchToHttp().getRequest().user = this.user;
                return this.doActivate;
            },
        };
    }
}
