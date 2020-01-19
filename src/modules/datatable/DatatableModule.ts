import {Global, Module} from '@nestjs/common';
import {DatatableService} from './services/DatatableService';

@Global()
@Module({
    providers: [DatatableService],
    exports: [DatatableService],
})
export class DatatableModule {
}
