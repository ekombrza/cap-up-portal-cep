import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IResource, Resource } from 'src/app/models-services/ressource/resource.model';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';


@Injectable({
  providedIn: 'root'
})
export class ResourcesRoutingResolveService implements Resolve<IResource> {

  constructor(protected service: ResourceService, protected router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IResource | Observable<IResource> | Promise<IResource> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((resource: HttpResponse<Resource>) => {
          if (resource.body) {
            return of(resource.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Resource());
  }
}
