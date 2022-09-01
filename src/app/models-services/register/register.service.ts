import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrlJHipsterApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }

  signUp(account: any): Observable<any> {
    return this.http.post(baseUrlJHipsterApi + 'api/extended/register', account);
  }

  saveForOther(account: any): Observable<any> {
    return this.http.post(baseUrlJHipsterApi + 'api/extended/registerForOther', account);
    
  }

  resendEmail(login: string): Observable<any> {
    return this.http.post(baseUrlJHipsterApi + 'api/extended/resendMail', login);
    
  }
}