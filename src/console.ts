import {BootstrapConsole} from 'nestjs-console';
import {ConsoleModule} from './modules/console/ConsoleModule';

BootstrapConsole.init({
    module: ConsoleModule,
    contextOptions: {
        logger: console,
    },
})
    .then(({boot}) => boot())
    // tslint:disable-next-line:no-console
    .catch(e => console.log('Error', e));

