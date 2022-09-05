import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrlJHipsterApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {

  public resourceUrl = baseUrlJHipsterApi + 'api/extended/activate';

  constructor(private http: HttpClient) { }

  get(key: string): Observable<{}> {
    return this.http.get(this.resourceUrl, {
      params: new HttpParams().set('key', key),
    });
  }
}
