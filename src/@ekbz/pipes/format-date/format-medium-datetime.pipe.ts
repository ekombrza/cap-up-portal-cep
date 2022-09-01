import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';

@Pipe({
  name: 'formatMediumDatetime',
})
export class FormatMediumDatetimePipe implements PipeTransform {
  transform(day: dayjs.Dayjs | null | undefined): string {
    console.log('day :', day);
    return day ? day.locale('fr').format('D MMM YYYY HH:mm:ss') : '';
  }
}
