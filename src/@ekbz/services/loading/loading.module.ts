import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from 'src/@ekbz/services/loading/loading.interceptor';

@NgModule({
    providers: [
        {
            provide : HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi   : true
        }
    ]
})
export class LoadingModule
{
}
