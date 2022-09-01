import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { IResource } from 'src/app/models-services/ressource/resource.model';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';
import { ISectionResource, SectionResource } from 'src/app/models-services/section-ressource/section-resource.model';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  isSaving = false;

  resourcesSharedCollection: IResource[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.maxLength(200)]],
    contentSection: [],
    orderSection: [null, [Validators.required]],
    creationDate: [null, [Validators.required]],
    updatedDate: [],
    resource: [],
  });

  constructor(
    protected eventManager: EventManager,
    protected sectionResourceService: SectionResourceService,
    protected resourceService: ResourceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resource, sectionResource }) => {
      console.log('resource, sectionResource : ', resource, sectionResource);
      const today = dayjs().startOf('day');
      if (sectionResource.id === undefined) {
        sectionResource.creationDate = today;
        sectionResource.updatedDate = today;
        sectionResource.resource = resource;
      }else {
        sectionResource.updatedDate = today;
      }

      this.updateForm(sectionResource);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sectionResource = this.createFromForm();
    if (sectionResource.id !== undefined) {
      this.subscribeToSaveResponse(this.sectionResourceService.update(sectionResource));
    } else {
      this.subscribeToSaveResponse(this.sectionResourceService.create(sectionResource));
    }
  }

  trackResourceById(index: number, item: IResource): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISectionResource>>): void {
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

  protected updateForm(sectionResource: ISectionResource): void {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    this.editForm.patchValue({
      id: sectionResource.id,
      title: sectionResource.title,
      contentSection: sectionResource.contentSection,
      orderSection: sectionResource.orderSection,
      creationDate: sectionResource.creationDate ? sectionResource.creationDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: sectionResource.updatedDate ? sectionResource.updatedDate.format(DATE_TIME_FORMAT) : null,
      resource: sectionResource.resource,
    });

    this.resourcesSharedCollection = this.resourceService.addResourceToCollectionIfMissing(
      this.resourcesSharedCollection,
      sectionResource.resource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.resourceService
      .query()
      .pipe(map((res: HttpResponse<IResource[]>) => res.body ?? []))
      .pipe(
        map((resources: IResource[]) =>
          this.resourceService.addResourceToCollectionIfMissing(resources, this.editForm.get('resource')!.value)
        )
      )
      .subscribe((resources: IResource[]) => (this.resourcesSharedCollection = resources));
  }

  protected createFromForm(): ISectionResource {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    return {
      ...new SectionResource(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      contentSection: this.editForm.get(['contentSection'])!.value,
      orderSection: this.editForm.get(['orderSection'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? dayjs(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      resource: this.editForm.get(['resource'])!.value,
    };
  }
}
