import { NgModule } from '@angular/core';
import { ScrollbarDirective } from 'src/@ekbz/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [
        ScrollbarDirective
    ],
    exports     : [
        ScrollbarDirective
    ]
})
export class ScrollbarModule
{
}
