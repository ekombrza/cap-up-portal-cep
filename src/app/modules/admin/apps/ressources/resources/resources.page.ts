import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { forkJoin, observable, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { IApplication } from 'src/app/models-services/application/application.model';
import { ApplicationService } from 'src/app/models-services/application/application.service';
import { ICategorie } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';
import { IMembre, Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { IResource } from 'src/app/models-services/ressource/resource.model';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';


@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {
  lastRouteSegment;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  itemsPerPage = 20;
  nbResultResource: number = 0;

  form: UntypedFormGroup;
  filtersCheckboxes?: FilterCheckboxObject[];
  categoriesCheckboxes?: FilterCheckboxObject[];
  contentTypesCheckboxes? : FilterCheckboxObject[];

  resources?: IResource[];
  applicationData?: IApplicationData;
  applicationRessource?: IApplication;
  connectedMembre: Membre;

  allMembresChurch: IMembre[] | null = [];

  selectedFilter? : string[];
  isLoadingCategories = false;
  isLoadingResources = false;
  isLoadingApplicationData = false;
  isLoadingApplication = false;
  isLoadedMembreForShared = false;

  constructor(
    protected categorieService: CategorieService,
    protected fb: UntypedFormBuilder,
    protected resourceService: ResourceService,
    protected applicationDataService: ApplicationDataService,
    protected applicationService: ApplicationService,
    private membreService: MembreService,
    public toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    ) { 
      this.form = fb.group({
        selectedFiltersCheckBoxes:  new UntypedFormArray([]),
        selectedCategoriesCheckBoxes:  new UntypedFormArray([]),
        selectedContentTypesCheckBoxes:  new UntypedFormArray([]),
        orderFilter: ['newest']
       });
       this.selectedFilter = [];
    }


  ngOnInit() {

    this.detectCategorieByRoute();
    
    forkJoin([
      this.membreService.queryCurrentUser().pipe(map(result => result.body)),
      this.applicationService.query({'name.equals':'Resource Management'}).pipe(map(result => result.body[0])),
    ]).subscribe(data => {
      console.log('data', data)
      this.connectedMembre = data[0];
      console.log('Connectedmembre :',this.connectedMembre);
      this.applicationRessource  = data[1];
      console.log('applicationRessource :',this.applicationRessource);
      this.loadAllApplicationData();
    }, error => {
      console.log('Erreur du chargement du membre connecté, de l application et de applicationDdata', error);
    },
    () => {
      this.loadAllFiltersCheckBoxes();
      this.loadAllContentTypesCheckBoxes();
      this.loadAllCategoriesCheckBoxes();
      
    });
  }

  detectCategorieByRoute() {
    this.lastRouteSegment = this.router.url.split('?')[0].split('/').pop();
    console.log('this.lastRouteSegment :' ,this.lastRouteSegment);
  }

  checkTheCategorieBoxAccordingRoute() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        var searchCategorieSelected = params.searchCategorie;
        //var typeResourceSelected = params.typeResource;
        console.log('searchCategorieSelected', searchCategorieSelected);
        //console.log('typeResourceSelected', typeResourceSelected);
        //if(typeResourceSelected){
        //  this.checkResourcesContentType(typeResourceSelected);
        //} else 
        if(searchCategorieSelected){
          this.checkCategorieCheckbox(searchCategorieSelected);
        } 
      }
    );
  }

  checkTheContentTypeBoxAccordingRoute() {
    if(this.lastRouteSegment === 'formations'){
      this.checkResourcesContentType('Formations');
    }
    if(this.lastRouteSegment === 'ressources'){
      this.checkResourcesContentType('Ressources');
    }
  }

  loadAllResources(): void {
    this.isLoadingResources = true;
    var requestFilter = {};
    requestFilter = this.generateQueryFilter(this.form.controls['selectedCategoriesCheckBoxes'] as UntypedFormArray, requestFilter, 'categoriesId.in');
    requestFilter = this.generateQueryFilter(this.form.controls['selectedContentTypesCheckBoxes'] as UntypedFormArray, requestFilter, 'typeResourceEnum.in');
    requestFilter = this.generateQueryFilter(this.form.controls['selectedFiltersCheckBoxes'] as UntypedFormArray, requestFilter, 'id.notIn');
    requestFilter['distinct'] = 'true';
    if(!this.isAdministrateur()){
      requestFilter['publish.equals'] = 'true';
    }
    requestFilter['sort'] = this.form.get('orderFilter').value === 'popular' ? ['nbReadForPopularity,desc']:['creationDate,desc'] ;
    requestFilter['page']=this.paginator.pageIndex;
    requestFilter['size']=this.itemsPerPage;
    console.log('queryFilter',requestFilter);
    this.resourceService.query(requestFilter).subscribe({
      next: (res: HttpResponse<IResource[]>) => {
        this.isLoadingResources = false;
        this.resources = res.body ?? [];
        const XTotalCount = res.headers.get('X-Total-Count');
        this.nbResultResource = XTotalCount ? Number.parseInt(res.headers.get('X-Total-Count')) : 0;
        console.log('resources : ', this.resources);
      },
      error: () => {
        this.isLoadingResources = false;
      },
    });
  }

  loadAllApplicationData(): void {
    this.isLoadingApplicationData = true;
    this.applicationDataService.query({'applicationId.equals':this.applicationRessource?.id, 'membreId.equals': this.connectedMembre?.id})
    .pipe(map(applicationData => applicationData.body[0]))
    .subscribe({
      next: (res: IApplicationData) => {
        this.isLoadingApplicationData = false;
        this.applicationData = res;
        this.applicationDataService.setApplicationDataObs(this.applicationData);
        console.log('application-data : ',this.applicationData)
      },
      error: () => {
        this.isLoadingApplicationData = false;
      },
    });
  }

  generateQueryFilter(formElement: UntypedFormArray, requestFilter: any, filterName: string){

    if(formElement.length > 0){
      var requestFilters = [];
      formElement.controls.forEach((filterObj) => {
        const filterCheckboxObject =  filterObj.value as FilterCheckboxObject;
        switch(filterName) { 
          case 'categoriesId.in': { 
            requestFilters.push(filterCheckboxObject.categorie.id);
             break; 
          } 
          case 'typeResourceEnum.in': { 
            if(filterCheckboxObject.categorie.name === 'Formations') {
              requestFilters.push('COURS'); 
            }
            if(filterCheckboxObject.categorie.name === 'Ressources') {
              requestFilters.push('RESSOURCE'); 
            }
            
             break; 
          } 
          case 'id.notIn': { 
            this.applicationData.resourcesVieweds.forEach(resourceViewved => 
              requestFilters.push(resourceViewved.id)
              )
            
            break; 
          }
        }
      });
      requestFilter[filterName] = requestFilters;
    }
    return requestFilter;
  }

  loadAllFiltersCheckBoxes(): void {
    this.filtersCheckboxes = [
      { categorie: { name:'Cacher le contenu déjà vu' }, checked: false},
    ];
  }

  loadAllContentTypesCheckBoxes(): void {
    this.contentTypesCheckboxes = [
      { categorie: { name:'Formations' }, checked: false},
      { categorie: { name:'Ressources' }, checked: false}
    ];
  }

  loadAllCategoriesCheckBoxes(): void {
    this.isLoadingCategories = true;
    let typeRessource = 'COURS';
    if(this.lastRouteSegment == 'ressources'){
      typeRessource = 'RESSOURCE';
    }
    this.categorieService.query({'typeResourceEnum.equals':typeRessource}).subscribe({
      next: (res: HttpResponse<ICategorie[]>) => {
        this.isLoadingCategories = false;
        if(res.body){
          let categorieViewObjects : FilterCheckboxObject[] = [];
          res.body.forEach(categorie => 
            categorieViewObjects.push({categorie, checked:false }));
          this.categoriesCheckboxes = categorieViewObjects;
        }else {
          this.categoriesCheckboxes = [];
        }
        console.log('this.categories' , this.categoriesCheckboxes);
        // Check the Resources or formations checkbox according the route 
      this.checkTheCategorieBoxAccordingRoute();
      this.checkTheContentTypeBoxAccordingRoute();
      this.loadAllResources();
      },
      error: () => {
        this.isLoadingCategories = false;
      },
    });
  }


  /**
   * check the 'Resource' Checkbox
   */
  private checkResourcesContentType(resourceNameToCheck: string) {
    if(!this.selectedFilter.includes(resourceNameToCheck)){
      const formSelectedCheckboxes = (this.form.controls['selectedContentTypesCheckBoxes'] as UntypedFormArray);
      const selectedContentType = this.contentTypesCheckboxes.find(x => x.categorie.name === resourceNameToCheck);
      this.checkCheckbox(selectedContentType, formSelectedCheckboxes);
    }
  }

   /**
   * check the 'Categories' Checkbox
   */
    private checkCategorieCheckbox(categorieNameToCheck: string) {
      if(!this.selectedFilter.includes(categorieNameToCheck)){
        const formSelectedCheckboxes = (this.form.controls['selectedCategoriesCheckBoxes'] as UntypedFormArray);
        const selectedContentType = this.categoriesCheckboxes.find(x => x.categorie.name === categorieNameToCheck);
        this.checkCheckbox(selectedContentType, formSelectedCheckboxes);
      }
    }

  onCheckboxChange(event: any, checkboxObjSelected: FilterCheckboxObject, formControlName : string) {
    const formSelectedCheckboxes = (this.form.controls[formControlName] as UntypedFormArray);
    if (event.target.checked) {
      this.checkCheckbox(checkboxObjSelected, formSelectedCheckboxes);
    } else {
      this.uncheckCheckBox(checkboxObjSelected, formSelectedCheckboxes);
    }

  }

  onChangeOrderSelect(event: any){
    console.log('Selected Order Select ',event.target.value);
    this.loadAllResources();
  }

  onEffacerButtonClick() {
    console.log('deleteAllFilterChip :', this.selectedFilter);
    const selectedFilterrConst =  [...this.selectedFilter];
    selectedFilterrConst.forEach(
      filtrerSelectedValue => {
        console.log('delete : ', filtrerSelectedValue);
        this.deleteFilterIonChip(filtrerSelectedValue, true);
      }
      );
  }

  /**
   * Uncheck the checkbox => delete in the formControlName and in the selectedFilter Object
   * @param checkboxObjSelected 
   * @param formSelectedCheckboxes 
   */
  private uncheckCheckBox(checkboxObjSelected: FilterCheckboxObject, formSelectedCheckboxes: UntypedFormArray) {
    const index = formSelectedCheckboxes.controls
      .findIndex(x => x.value === checkboxObjSelected);
    formSelectedCheckboxes.removeAt(index);

    const indexFilterToDelete = this.selectedFilter.findIndex(x => x === checkboxObjSelected.categorie.name);
    this.selectedFilter.splice(indexFilterToDelete, 1);
    this.loadAllResources();
  }

  /**
   * check the checkbox => add in the formControlName and in the selectedFilter Object
   * @param checkboxObjSelected 
   * @param formSelectedCheckboxes 
   */
  private checkCheckbox(checkboxObjSelected: FilterCheckboxObject, formSelectedCheckboxes: UntypedFormArray) {
    //this.deleteFilterIonChip(checkboxObjSelected.categorie.name, false);
    checkboxObjSelected.checked = true;
    formSelectedCheckboxes.push(new UntypedFormControl(checkboxObjSelected));
    this.selectedFilter.push(checkboxObjSelected.categorie.name);
    this.loadAllResources();
  }

  deleteFilterIonChip(selectedIonChipName: string, loadAllRessource: boolean){
    this.deleteSelectedIonChipInFormAndFilter(selectedIonChipName, this.filtersCheckboxes, 'selectedFiltersCheckBoxes'); 
    this.deleteSelectedIonChipInFormAndFilter(selectedIonChipName, this.contentTypesCheckboxes, 'selectedContentTypesCheckBoxes'); 
    this.deleteSelectedIonChipInFormAndFilter(selectedIonChipName, this.categoriesCheckboxes, 'selectedCategoriesCheckBoxes'); 
    if(loadAllRessource){
      this.loadAllResources();
    }
  }

  private deleteSelectedIonChipInFormAndFilter(selectedIonChipName: string, listFilterCheckboxObject: FilterCheckboxObject[], formControlName : string) {
    const selectedFilter = listFilterCheckboxObject.find(x => x.categorie.name === selectedIonChipName);
    if (selectedFilter) {
      selectedFilter.checked = false;
      this.deleteSelectedCheckboxInForm(selectedFilter, formControlName);
      this.deleteSelectedCheckboxInFilter(selectedIonChipName);
    }
  }

  private deleteSelectedCheckboxInFilter(selectedIonChipName: string) {
    const indexCategorieName = this.selectedFilter.findIndex(x => x === selectedIonChipName);
    this.selectedFilter.splice(indexCategorieName, 1);
  }

  private deleteSelectedCheckboxInForm(selectedCheckbox: FilterCheckboxObject, formControlName : string) {
    const formSelectedCheckbox = (this.form.controls[formControlName] as UntypedFormArray);
    const index = formSelectedCheckbox.controls
      .findIndex(x => x.value === selectedCheckbox);
    formSelectedCheckbox.removeAt(index);
  }

  submit() {
    console.log(this.form.value);
  }

  isAdministrateur(){
   return this.connectedMembre?.roles.filter(role => role.name == 'Administrateur' && role.application.name == 'Resource Management').length == 1;
  }

  goToAddResource(){
    this.router.navigate(['apps/ressources/ressources', 'new']);
  }

  addRessourceToBookmark(resource: IResource){
    if(!this.isIncludedBookmark(resource)){
      this.applicationData.resourcesBookmarks.push(resource);
      this.applicationDataService.partialUpdate(this.applicationData).subscribe(async () => { 
        this.applicationDataService.setApplicationDataObs(this.applicationData);
        const toast = await this.toastController.create({
          message: 'Ressource ajoutée à vos marques-pages',
          duration: 2000
        });
        toast.present();
      });
      
    }else {
      console.log('La ressource existe déjà dans les bookmarks')
    }
    
  }

  isIncludedBookmark(resource: IResource){
    return this.applicationData.resourcesBookmarks.map(res => res.id).includes(resource.id);
  }

  loadUsersShared(){
    if( this.allMembresChurch == null || this.allMembresChurch.length == 0 ) {
      this.isLoadedMembreForShared = false;
      this.membreService.query({'jobStatus.equals': 'ACTIVE'}).pipe(map(result => result.body)).subscribe((membre) => {
        this.isLoadedMembreForShared = true;
        console.log('allMembresChurch', membre);
        this.allMembresChurch = membre;
        const indexOfObject = this.allMembresChurch.map(membre => membre.id).indexOf(this.connectedMembre.id);
        if(indexOfObject !== -1){
          this.allMembresChurch.splice(indexOfObject, 1);
        }
      },
      error => {
        this.isLoadedMembreForShared = true;
      })
    }

  }

  isIncludedShared(resource: IResource, appData: IApplicationData){
    return appData.resourcesSharedWithYous.map(res => res.id).includes(resource.id);
  }

  shareRessource(resource: IResource, membre: IMembre) {
    console.log('Shared resource ' + resource.id + 'to the user ' + membre.id);
    this.applicationDataService.query({'applicationId.equals':this.applicationRessource?.id, 'membreId.equals': membre.id})
    .pipe(map(applicationData => applicationData.body[0]))
    .subscribe({
      next: (appData: IApplicationData) => {
        if(!this.isIncludedShared(resource,appData)){
          appData.resourcesSharedWithYous.push(resource);
          this.applicationDataService.partialUpdate(appData).subscribe(async ()=>{
            const toast = await this.toastController.create({
              message: 'Ressource ajoutée dans les resources partagées de ' + membre.internalUser.firstName + ' ' +  membre.internalUser.lastName, 
              duration: 2000
            });
            toast.present();
          });
        } else {
          console.log ('ressource partagée déjà inclu pour cet utilisateur');
        }
      },
      error:async ()=> {
        const toast = await this.toastController.create({
          message: 'Erreur lors de l ajout de la resources partagées de ' + membre.internalUser.firstName + ' ' +  membre.internalUser.lastName,
          duration: 2000
        });
        toast.present();
      }
    });
  }

  getHref(resourceId){  
     var currentUrl = window.location.href;
     var indexToReplace = currentUrl.lastIndexOf('/apps');
     var domain = currentUrl.substring(0,indexToReplace);
     return domain + '/apps/ressources/resources/' + resourceId +  '/view'

  }

  onChangePage(event: PageEvent){
    this.paginator.pageIndex = event.pageIndex;
    this.loadAllResources();
  }

  disableTypeCheckboxes(contentType: string){
    return contentType.toLowerCase() !== this.lastRouteSegment.toLowerCase();
  }
}

export class FilterCheckboxObject {
  categorie: ICategorie;
  checked: boolean;
}

export class RequestFilter {
  key: string;
  value: string;

  constructor(key:string, value:string) {
    this.key = key;
    this.value = value;
  }
}
