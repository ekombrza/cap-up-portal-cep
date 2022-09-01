import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatMediumDatePipe } from './format-medium-date.pipe';
import { FormatMediumDatetimePipe } from './format-medium-datetime.pipe';



@NgModule({
  declarations: [FormatMediumDatePipe, FormatMediumDatetimePipe],
  imports: [
    CommonModule
  ],
  exports: [FormatMediumDatePipe, FormatMediumDatetimePipe]
})
export class FormatDatePipeSharedModule { }
