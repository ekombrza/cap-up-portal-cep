import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrlJHipsterApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  public baseUrl = baseUrlJHipsterApi + 'api/account';

  constructor(private http: HttpClient) { }

  save(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(this.baseUrl + '/change-password', { currentPassword, newPassword });
  }
}
