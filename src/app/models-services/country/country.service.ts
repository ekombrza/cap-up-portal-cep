import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Country } from './country.model';
export type EntityResponseType = HttpResponse<Country>;
export type EntityArrayResponseType = HttpResponse<Country[]>;

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http:HttpClient) { }
  
  public resourceUrl = baseUrlJHipsterApi + 'api/countries';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/countries';
  
  create(country: Country): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .post<Country>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(country: Country): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .put<Country>(`${this.resourceUrl}/${this.getCountryIdentifier(country) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(country: Country): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .patch<Country>(`${this.resourceUrl}/${this.getCountryIdentifier(country) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Country>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Country[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCountryToCollectionIfMissing(countryCollection: Country[], ...countriesToCheck: (Country | null | undefined)[]): Country[] {
    const countries: Country[] = countriesToCheck.filter(this.isPresent);
    if (countries.length > 0) {
      const countryCollectionIdentifiers = countryCollection.map(countryItem => this.getCountryIdentifier(countryItem)!);
      const countriesToAdd = countries.filter(countryItem => {
        const countryIdentifier = this.getCountryIdentifier(countryItem);
        if (countryIdentifier == null || countryCollectionIdentifiers.includes(countryIdentifier)) {
          return false;
        }
        countryCollectionIdentifiers.push(countryIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countryCollection];
    }
    return countryCollection;
  }

  protected convertDateFromClient(country: Country): Country {
    return Object.assign({}, country, {
      creationDate: country.creationDate?.isValid() ? country.creationDate.toJSON() : undefined,
      updatedDate: country.updatedDate?.isValid() ? country.updatedDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? dayjs(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((denomination: Country) => {
        denomination.creationDate = denomination.creationDate ? dayjs(denomination.creationDate) : undefined;
        denomination.updatedDate = denomination.updatedDate ? dayjs(denomination.updatedDate) : undefined;
      });
    }
    return res;
  }
  
  getCountryIdentifier(denomination: Country): number | undefined {
    return denomination.id;
  }

  isPresent<T>(t: T | undefined | null | void): t is T {
    return t !== undefined && t !== null;
  }

}