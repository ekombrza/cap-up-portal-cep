import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { IUser, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  constructor(private http:HttpClient) { }
  
  public baseUrlExtended = baseUrlJHipsterApi + 'api/admin/extended/users';
  public baseUrl = baseUrlJHipsterApi + 'api/admin/users';
  
  query(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<string[]>(this.baseUrlExtended + '/currentConnected', { params: options, observe: 'response' });
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${login}`);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<User>(this.baseUrl, user);
  }

}
