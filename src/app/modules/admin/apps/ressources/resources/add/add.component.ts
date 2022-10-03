import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ICategorie } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';
import { IResource, Resource } from 'src/app/models-services/ressource/resource.model';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';
import { TypeResourceEnum } from 'src/app/models-services/ressource/type-resource-enum.model';
import { IRole } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';
import { FILE_EXPLORER_DNS_STATIQUE } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  isSaving = false;
  typeResourceEnumValues = Object.keys(TypeResourceEnum);

  resourcesSharedCollection: IResource[] = [];
  categoriesSharedCollection: ICategorie[] = [];
  rolesSharedCollection: IRole[] = [];
  @ViewChild(IonModal) modal: IonModal;
  selectedFilePath: string;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.maxLength(200)]],
    imageLink: [null, [Validators.required, Validators.maxLength(200)]],
    description: [null, [Validators.required]],
    nbReadForPopularity: [],
    typeResourceEnum: [null, [Validators.required]],
    publish: [null, [Validators.required]],
    creationDate: [null, [Validators.required]],
    updatedDate: [],
    relatedContent: [],
    categories: [null, [Validators.required]],
    roles: [null, [Validators.required]],
  });

  constructor(
    protected eventManager: EventManager,
    protected resourceService: ResourceService,
    protected categorieService: CategorieService,
    protected roleService: RoleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resource }) => {
      if (resource.id === undefined) {
        const today = dayjs().startOf('day');
        resource.creationDate = today;
        resource.updatedDate = today;
      }

      this.updateForm(resource);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  updateResourceState(ressource: Resource): void {
    if(ressource.typeResourceEnum === TypeResourceEnum.RESSOURCE){
      this.router.navigate(['/apps/ressources/ressources', ressource.id, 'view','edit']);
    }

    if(ressource.typeResourceEnum === TypeResourceEnum.COURS){
      this.router.navigate(['/apps/ressources/formations', ressource.id, 'view','edit']);
    }
  }

  save(): void {
    this.isSaving = true;
    const resource = this.createFromForm();
    if (resource.id !== undefined) {
      this.subscribeToSaveResponse(this.resourceService.update(resource));
    } else {
      this.subscribeToSaveResponse(this.resourceService.create(resource));
    }
  }

  trackResourceById(index: number, item: IResource): number {
    return item.id!;
  }

  trackCategorieById(index: number, item: ICategorie): number {
    return item.id!;
  }

  trackRoleById(index: number, item: IRole): number {
    return item.id!;
  }

  getSelectedCategorie(option: ICategorie, selectedVals?: ICategorie[]): ICategorie {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedRole(option: IRole, selectedVals?: IRole[]): IRole {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResource>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (resource: HttpResponse<IResource>) => this.onSaveSuccess(resource),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(resource : HttpResponse<IResource>): void {
    this.updateResourceState(resource.body);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(resource: IResource): void {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    this.editForm.patchValue({
      id: resource.id,
      title: resource.title,
      imageLink: resource.imageLink,
      description: resource.description,
      nbReadForPopularity: resource.nbReadForPopularity?resource.nbReadForPopularity:0,
      typeResourceEnum: resource.typeResourceEnum,
      publish: resource.publish,
      creationDate: resource.creationDate ? resource.creationDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: resource.updatedDate ? resource.updatedDate.format(DATE_TIME_FORMAT) : null,
      relatedContent: resource.relatedContent,
      categories: resource.categories,
      roles: resource.roles,
    });

    this.resourcesSharedCollection = this.resourceService.addResourceToCollectionIfMissing(
      this.resourcesSharedCollection,
      resource.relatedContent
    );
    this.categoriesSharedCollection = this.categorieService.addCategorieToCollectionIfMissing(
      this.categoriesSharedCollection,
      ...(resource.categories ?? [])
    );
    this.rolesSharedCollection = this.roleService.addRoleToCollectionIfMissing(this.rolesSharedCollection, ...(resource.roles ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.resourceService
      .query()
      .pipe(map((res: HttpResponse<IResource[]>) => res.body ?? []))
      .pipe(
        map((resources: IResource[]) =>
          this.resourceService.addResourceToCollectionIfMissing(resources, this.editForm.get('relatedContent')!.value)
        )
      )
      .subscribe((resources: IResource[]) => (this.resourcesSharedCollection = resources));

    this.categorieService
      .query()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategorie[]) =>
          this.categorieService.addCategorieToCollectionIfMissing(categories, ...(this.editForm.get('categories')!.value ?? []))
        )
      )
      .subscribe((categories: ICategorie[]) => (this.categoriesSharedCollection = categories));

    this.roleService
      .query({'applicationId.equals':1, 'sort' : ['typeRole,asc']})
      .pipe(map((res: HttpResponse<IRole[]>) => res.body ?? []))
      .pipe(map((roles: IRole[]) => this.roleService.addRoleToCollectionIfMissing(roles, ...(this.editForm.get('roles')!.value ?? []))))
      .subscribe((roles: IRole[]) => (this.rolesSharedCollection = roles));
  }

  protected createFromForm(): IResource {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    return {
      ...new Resource(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      imageLink: this.editForm.get(['imageLink'])!.value,
      description: this.editForm.get(['description'])!.value,
      nbReadForPopularity: this.editForm.get(['nbReadForPopularity'])!.value,
      typeResourceEnum: this.editForm.get(['typeResourceEnum'])!.value,
      publish: this.editForm.get(['publish'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? dayjs(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      relatedContent: this.editForm.get(['relatedContent'])!.value,
      categories: this.editForm.get(['categories'])!.value,
      roles: this.editForm.get(['roles'])!.value,
    };
  }

  onWillDismiss(event){

  }

  confirmModal(){
    this.modal.dismiss(null, 'confirm');
    if(this.selectedFilePath != undefined){
      var urlFile = FILE_EXPLORER_DNS_STATIQUE + this.shortcutLinkForder(this.selectedFilePath, 'DATA');
      this.editForm.patchValue({
        imageLink: urlFile
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
