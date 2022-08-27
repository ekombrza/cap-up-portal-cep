import { NgModule } from '@angular/core';
import { FindByKeyPipe } from 'src/@ekbz/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [
        FindByKeyPipe
    ],
    exports     : [
        FindByKeyPipe
    ]
})
export class FindByKeyPipeModule
{
}
