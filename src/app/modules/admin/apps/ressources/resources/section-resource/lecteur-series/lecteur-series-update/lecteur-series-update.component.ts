import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ILecteurSeries, LecteurSeries } from 'src/app/models-services/lecteur-serie/lecteur-series.model';
import { LecteurSeriesService } from 'src/app/models-services/lecteur-serie/lecteur-series.service';
import { TypeLecteurEnum } from 'src/app/models-services/lecteur-serie/type-lecteur-enum.model';
import { ISectionResource } from 'src/app/models-services/section-ressource/section-resource.model';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';
import { FILE_EXPLORER_DNS_STATIQUE } from 'src/environments/environment';

@Component({
  selector: 'app-lecteur-series-update',
  templateUrl: './lecteur-series-update.component.html',
  styleUrls: ['./lecteur-series-update.component.scss'],
})
export class LecteurSeriesUpdateComponent implements OnInit {
  isSaving = false;
  typeLecteurEnumValues = Object.keys(TypeLecteurEnum);

  sectionResourcesSharedCollection: ISectionResource[] = [];

  @ViewChild('modalMedia') modalMedia: IonModal;
  @ViewChild('modalImage') modalImage: IonModal;
  selectedFilePath: string;

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required, Validators.maxLength(200)]],
    supportLink: [null, [Validators.required, Validators.maxLength(400)]],
    imageLink: [null, [Validators.required, Validators.maxLength(400)]],
    order: [null, [Validators.required]],
    typeLecteurEnum: [null, [Validators.required]],
    creationDate: [null],
    updatedDate: [],
    sectionResource: [],
  });

  constructor(
    protected lecteurSeriesService: LecteurSeriesService,
    protected sectionResourceService: SectionResourceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lecteurSeries,  sectionResource}) => {
      console.log('lecteurSeries, sectionResource : ', lecteurSeries, sectionResource);
      const today = dayjs().startOf('day');
      if (lecteurSeries.id === undefined) {
        lecteurSeries.creationDate = today;
        lecteurSeries.updatedDate = today;
        lecteurSeries.sectionResource = sectionResource;
      }else {
        lecteurSeries.updatedDate = today;
      }

      this.updateForm(lecteurSeries);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lecteurSeries = this.createFromForm();
    if (lecteurSeries.id !== undefined) {
      this.subscribeToSaveResponse(this.lecteurSeriesService.update(lecteurSeries));
    } else {
      this.subscribeToSaveResponse(this.lecteurSeriesService.create(lecteurSeries));
    }
  }

  trackSectionResourceById(index: number, item: ISectionResource): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILecteurSeries>>): void {
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

  protected updateForm(lecteurSeries: ILecteurSeries): void {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    this.editForm.patchValue({
      id: lecteurSeries.id,
      titre: lecteurSeries.titre,
      supportLink: lecteurSeries.supportLink,
      imageLink: lecteurSeries.imageLink,
      order: lecteurSeries.order,
      typeLecteurEnum: lecteurSeries.typeLecteurEnum,
      creationDate: lecteurSeries.creationDate ? lecteurSeries.creationDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: lecteurSeries.updatedDate ? lecteurSeries.updatedDate.format(DATE_TIME_FORMAT) : null,
      sectionResource: lecteurSeries.sectionResource,
    });

    this.sectionResourcesSharedCollection = this.sectionResourceService.addSectionResourceToCollectionIfMissing(
      this.sectionResourcesSharedCollection,
      lecteurSeries.sectionResource
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): ILecteurSeries {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    return {
      ...new LecteurSeries(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      supportLink: this.editForm.get(['supportLink'])!.value,
      imageLink: this.editForm.get(['imageLink'])!.value,
      order: this.editForm.get(['order'])!.value,
      typeLecteurEnum: this.editForm.get(['typeLecteurEnum'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? dayjs(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      sectionResource: this.editForm.get(['sectionResource'])!.value,
    };
  }

  onWillDismiss(event){

  }

  confirmModal(fieldModalSelected: string){
    
    if(this.selectedFilePath != undefined){
      var urlFile = FILE_EXPLORER_DNS_STATIQUE + this.shortcutLinkForder(this.selectedFilePath, 'DATA');
      if(fieldModalSelected =='supportLink'){
        this.modalMedia.dismiss(null, 'confirm');
        this.editForm.patchValue({
          supportLink: urlFile
        });
      }
      if(fieldModalSelected =='imageLink'){
        this.modalImage.dismiss(null, 'confirm');
        this.editForm.patchValue({
          imageLink: urlFile
        });
      }
      
    }
  }

  shortcutLinkForder(linkFolder: string, firstStringToShortcut: string){
    return '/' + linkFolder.substring(linkFolder.indexOf(firstStringToShortcut));
  }
  cancelModal(fieldModalSelected: string) {
    if(fieldModalSelected =='supportLink'){
      this.modalMedia.dismiss(null, 'cancel');
    }
    if(fieldModalSelected =='imageLink'){
      this.modalImage.dismiss(null, 'cancel');
    }
    
  }

  onSelectedPathFile(path:string){
    console.log('onSelectedPathFile',path );
    this.selectedFilePath = path;
  }

}
