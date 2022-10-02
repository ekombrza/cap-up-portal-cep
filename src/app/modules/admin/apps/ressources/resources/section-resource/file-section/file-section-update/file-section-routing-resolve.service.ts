import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { File, IFile } from 'src/app/models-services/file/file.model';
import { FileService } from 'src/app/models-services/file/file.service';


@Injectable({
  providedIn: 'root'
})
export class FileSectionRoutingResolveService implements Resolve<IFile> {

  constructor(protected service: FileService, protected router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IFile | Observable<IFile> | Promise<IFile> {
    const id = route.params['idFile'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((file: HttpResponse<File>) => {
          if (file.body) {
            return of(file.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new File());
  }
}
