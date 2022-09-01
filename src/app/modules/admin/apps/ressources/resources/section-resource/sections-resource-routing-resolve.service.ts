import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ISectionResource, SectionResource } from 'src/app/models-services/section-ressource/section-resource.model';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';


@Injectable({
  providedIn: 'root'
})
export class SectionsResourceRoutingResolveService implements Resolve<ISectionResource> {

  constructor(protected service: SectionResourceService, protected router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ISectionResource | Observable<ISectionResource> | Promise<ISectionResource> {
    const id = route.params['idSection'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sectionResource: HttpResponse<SectionResource>) => {
          if (sectionResource.body) {
            return of(sectionResource.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SectionResource());
  }
}
