import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { File, IFile } from 'src/app/models-services/file/file.model';
import { FileService } from 'src/app/models-services/file/file.service';
import { ISectionResource } from 'src/app/models-services/section-ressource/section-resource.model';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';
import { ITypeFile } from 'src/app/models-services/type-file/type-file.model';
import { TypeFileService } from 'src/app/models-services/type-file/type-file.service';
import { FILE_EXPLORER_DNS_STATIQUE } from 'src/environments/environment';

@Component({
  selector: 'app-file-section-update',
  templateUrl: './file-section-update.component.html',
  styleUrls: ['./file-section-update.component.scss'],
})
export class FileSectionUpdateComponent implements OnInit {
  isSaving = false;

  typeFilesSharedCollection: ITypeFile[] = [];
  sectionResourcesSharedCollection: ISectionResource[] = [];

  @ViewChild(IonModal) modal: IonModal;
  selectedFilePath: string;

  editForm = this.fb.group({
    id: [],
    filename: [null, [Validators.required, Validators.maxLength(200)]],
    filePathName: [null, [Validators.required, Validators.maxLength(300)]],
    creationDate: [null, [Validators.required]],
    updatedDate: [],
    typeFile: [],
    sectionResource: [],
  });

  constructor(
    protected fileService: FileService,
    protected typeFileService: TypeFileService,
    protected sectionResourceService: SectionResourceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file, sectionResource }) => {
      console.log('file, sectionResource : ', file, sectionResource);
      const today = dayjs().startOf('day');
      if (file.id === undefined) {
        file.creationDate = today;
        file.updatedDate = today;
        file.sectionResource = sectionResource;
      }else {
        file.updatedDate = today;
      }
     
      this.updateForm(file);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.createFromForm();
    if (file.id !== undefined) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  trackTypeFileById(index: number, item: ITypeFile): number {
    return item.id!;
  }

  trackSectionResourceById(index: number, item: ISectionResource): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(file: IFile): void {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    this.editForm.patchValue({
      id: file.id,
      filename: file.filename,
      filePathName: file.filePathName,
      creationDate: file.creationDate ? file.creationDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: file.updatedDate ? file.updatedDate.format(DATE_TIME_FORMAT) : null,
      typeFile: file.typeFile,
      sectionResource: file.sectionResource,
    });

    this.typeFilesSharedCollection = this.typeFileService.addTypeFileToCollectionIfMissing(this.typeFilesSharedCollection, file.typeFile);
    this.sectionResourcesSharedCollection = this.sectionResourceService.addSectionResourceToCollectionIfMissing(
      this.sectionResourcesSharedCollection,
      file.sectionResource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeFileService
      .query()
      .pipe(map((res: HttpResponse<ITypeFile[]>) => res.body ?? []))
      .pipe(
        map((typeFiles: ITypeFile[]) =>
          this.typeFileService.addTypeFileToCollectionIfMissing(typeFiles, this.editForm.get('typeFile')!.value)
        )
      )
      .subscribe((typeFiles: ITypeFile[]) => (this.typeFilesSharedCollection = typeFiles));

    this.sectionResourceService
      .query()
      .pipe(map((res: HttpResponse<ISectionResource[]>) => res.body ?? []))
      .pipe(
        map((sectionResources: ISectionResource[]) =>
          this.sectionResourceService.addSectionResourceToCollectionIfMissing(sectionResources, this.editForm.get('sectionResource')!.value)
        )
      )
      .subscribe((sectionResources: ISectionResource[]) => (this.sectionResourcesSharedCollection = sectionResources));
  }

  protected createFromForm(): IFile {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    return {
      ...new File(),
      id: this.editForm.get(['id'])!.value,
      filename: this.editForm.get(['filename'])!.value,
      filePathName: this.editForm.get(['filePathName'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? dayjs(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      typeFile: this.editForm.get(['typeFile'])!.value,
      sectionResource: this.editForm.get(['sectionResource'])!.value,
    };
  }

  onWillDismiss(event){

  }

  confirmModal(){
    this.modal.dismiss(null, 'confirm');
    if(this.selectedFilePath != undefined){
      var urlFile = FILE_EXPLORER_DNS_STATIQUE + this.shortcutLinkForder(this.selectedFilePath, 'DATA');
      this.editForm.patchValue({
        filePathName: urlFile
    });
    }
  }

  shortcutLinkForder(linkFolder: string, firstStringToShortcut: string){
    return '/' + linkFolder.substring(linkFolder.indexOf(firstStringToShortcut));
  }
  cancelModal() {
    this.modal.dismiss(null, 'cancel');
  }

  onSelectedPathFile(path:string){
    console.log('onSelectedPathFile',path );
    this.selectedFilePath = path;
  }
}
