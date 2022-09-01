import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ILecteurSeries, LecteurSeries } from 'src/app/models-services/lecteur-serie/lecteur-series.model';
import { LecteurSeriesService } from 'src/app/models-services/lecteur-serie/lecteur-series.service';

@Injectable({
  providedIn: 'root'
})
export class LecteurSeriesRoutingResolveService implements Resolve<ILecteurSeries> {

  constructor(protected service: LecteurSeriesService, protected router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ILecteurSeries | Observable<ILecteurSeries> | Promise<ILecteurSeries> {
    const id = route.params['idLecteurSeries'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lecteurSerie: HttpResponse<LecteurSeries>) => {
          if (lecteurSerie.body) {
            return of(lecteurSerie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LecteurSeries());
  }
}
