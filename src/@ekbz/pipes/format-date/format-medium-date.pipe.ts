import { Pipe, PipeTransform } from '@angular/core';
import 'dayjs/locale/fr'
import * as dayjs from 'dayjs';

@Pipe({
  name: 'formatMediumDate',
})
export class FormatMediumDatePipe implements PipeTransform {
  transform(day: dayjs.Dayjs | null | undefined): string {
    return day ? day.locale('fr').format('D MMM YYYY') : '';
  }
}
