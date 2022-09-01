import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import dayjs from "dayjs";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { baseUrlJHipsterApi } from "src/environments/environment";
import { IFileTree } from "./fileExplorer/file-tree.models";
import { IFile } from "./fileExplorer/file.models";


export type EntityResponseType = HttpResponse<IFileTree>;
export type EntityArrayResponseType = HttpResponse<IFileTree[]>;

@Injectable({ providedIn: 'root' })
export class FileExplorerService {
  public resourceUrl = baseUrlJHipsterApi + 'api/file-explorer';
  public resourceUrlFileUpload = baseUrlJHipsterApi + 'api/upload';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/file-explorer';

  constructor(protected http: HttpClient) {}

  getFileTree(dir: string): Observable<EntityResponseType> {
    return this.http
      .get<IFileTree>(`${this.resourceUrl}?dir=${dir}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertIsDirectory(res)));;
  }

  protected convertIsDirectory(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.childDirectories.forEach((file: IFile) => {
       file.isDirectory =true;
      });
      res.body.files.forEach((file: IFile) => {
        file.isDirectory =false;
       });
    }
    return res;
  }

  uploadFile(formData: FormData): Observable<EntityResponseType> {
    return this.http.post(this.resourceUrlFileUpload, formData, { observe: 'response' });
  }

  deleteFile(file: IFile): Observable<HttpResponse<{}>> {
    return this.http.delete(this.resourceUrlFileUpload + '?path=' + file.fullName, { observe: 'response' });
  }

  createDirectory(path:string): Observable<EntityResponseType> {
    return this.http.post(this.resourceUrlFileUpload + '/add-dir',path, { observe: 'response' });
  }
}
