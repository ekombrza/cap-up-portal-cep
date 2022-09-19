import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { IMembre } from 'src/app/models-services/membre/membre.model';
import { IApplication } from 'src/app/models-services/application/application.model';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { IResource } from 'src/app/models-services/ressource/resource.model';
import { ISectionResource, SectionResource } from 'src/app/models-services/section-ressource/section-resource.model';
import { IFile } from 'src/app/models-services/file/file.model';
import { ILecteurSeries } from 'src/app/models-services/lecteur-serie/lecteur-series.model';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';
import { FileService } from 'src/app/models-services/file/file.service';
import { LecteurSeriesService } from 'src/app/models-services/lecteur-serie/lecteur-series.service';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { IRessourceStatsLectureVideo, RessourceStatsLectureVideo } from 'src/app/models-services/statistiquesLectureVideo/ressource-stats-lecture-video.model';
import { IStatsLectureVideo, StatsLectureVideo } from 'src/app/models-services/statistiquesLectureVideo/StatsLectureVideo.model';
import { ApplicationService } from 'src/app/models-services/application/application.service';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { RessourceStatsLectureVideoService } from 'src/app/models-services/statistiquesLectureVideo/ressourceStatsLectureVideo.service';
import { SectionStats } from 'src/app/models-services/statistiquesLectureVideo/SectionsStats.model';
import { Icon, Player } from '@vime/angular';
import { SwiperComponent } from 'swiper/angular';
import { AuthService } from 'src/app/models-services/auth/auth.service';
import { DemandeAccesFormationPriveeService } from 'src/app/models-services/demande-acces-formation-privee/demande-acces-formation-privee.service';
import { DemandeAccesFormationPrivee, IDemandeAccesFormationPrivee } from 'src/app/models-services/demande-acces-formation-privee/demande-acces-formation-privee.model';
import { result } from 'lodash';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  connectedMembre: IMembre | null = null;
  allMembresChurch: IMembre[] | null = [];
  applicationRessource: IApplication | null = null;
  applicationData: IApplicationData | null = null;
  resource: IResource | null = null;
  numberPanelSelected: number;
  sectionsResource: ISectionResource[] | null = null;
  ressourceStatsLectureVideo: IRessourceStatsLectureVideo | null = null;
  statsLectureVideo: IStatsLectureVideo | null = null;
  files: IFile[] | null = null;
  lecteurVideoSeries: ILecteurSeries[] | null = null;
  lecteurAudioSeries: ILecteurSeries[] | null = null;
  @ViewChild('player') player!: Player;
  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  currentVideo: ILecteurSeries | null = null;
  currentAudio: ILecteurSeries | null = null;
  currentTimePlayerVideo: number = 0;
  currentTimePlayerAudio: number = 0;
  notTriggerPlaybackEnded = false;
  isResourceBookmarked: boolean = false;
  isLoadedMembreForShared = false;
  isAuthorizeToShowSection = false;
  
  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected sectionResourceService: SectionResourceService,
    protected resourceService: ResourceService,
    protected fileService: FileService,
    protected lecteurSeriesService: LecteurSeriesService,
    private alertController: AlertController,
    protected membreService: MembreService,
    protected applicationService: ApplicationService,
    protected applicationDataService: ApplicationDataService,
    protected ressourceStatsLectureVideoService: RessourceStatsLectureVideoService,
    private _authService : AuthService,
    public toastController: ToastController,
    private demandeAccesFormationPriveeService: DemandeAccesFormationPriveeService) { }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    var lastUrlValue = this.router.url.substring(this.router.url.length - 4);
    console.log('lastUrlValue',lastUrlValue);
    if(lastUrlValue === 'edit'){
      this.editMode = true;
    }

    this.activatedRoute.data.subscribe(({ resource }) => {
      this.resource = resource;
      console.log("resource :", this.resource);
      this.loadSectionsResource();

     this.isAuthorizeToShowSection = this.isAuthorize(this.resource);

      if(this.editMode == false) {
        this.resource.nbReadForPopularity =  this.resource.nbReadForPopularity + 1;
        
        this.resourceService.partialUpdate(this.resource).subscribe(() => {
          console.log('update nbReadForPopularity to ', this.resource.nbReadForPopularity);
        });
      }

      forkJoin([
        this.membreService.queryCurrentUser().pipe(map(result => result.body)),
        this.applicationService.query({'name.equals':'Resource Management'}).pipe(map(result => result.body[0])),
      ]).subscribe(data => {
        console.log('data', data)
        this.connectedMembre = data[0];
        console.log('Connectedmembre :',this.connectedMembre);
        this.applicationRessource  = data[1];
        console.log('applicationRessource :',this.applicationRessource);
        this.applicationDataService.getApplicatioNDataObs(this.applicationRessource.id,  this.connectedMembre.id, true)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe({
          next: (res: IApplicationData) => {
            this.applicationData = res;
            console.log('application-data detail page: ',this.applicationData);
            // Add resource in resourceviewed if not already in list
            if(this.applicationData && this.applicationData.resourcesVieweds){
              if(!this.applicationData.resourcesVieweds.map(resource => resource.id).includes(this.resource.id)){
                this.applicationData.resourcesVieweds.push(this.resource);
                this.applicationDataService.partialUpdate(this.applicationData).subscribe(() => {
                  this.applicationDataService.setApplicationDataObs(this.applicationData);
                  console.log('update applicationData To add ressourceViewed');
                });
              }
            }
            if(this.isIncludedBookmark(this.resource)){
              this.isResourceBookmarked = true;
            }
          },
          error: () => {
          },
        });
      }, error => {
          console.log('Erreur du chargement du membre connecté, de l application et de applicationDdata', error);
      }, () => {
        
      });
    });


  }


  private loadSectionsResource() {
    this.sectionResourceService.query({ 'resourceId.equals': this.resource.id, 'sort': ['orderSection,asc'] }).subscribe({
      next: (res: HttpResponse<IResource[]>) => {
        this.sectionsResource = res.body ?? [];
        this.sectionsResource = this.sortSectionByOrder()
        console.log('Sections Resource : ', this.sectionsResource);
      },
      error: () => {
      },
    });
  }

  sortSectionByOrder(): ISectionResource[] {
    return this.sectionsResource.sort((obj1, obj2) => {
      if (obj1.orderSection > obj2.orderSection) {
        return 1;
    }

    if (obj1.orderSection < obj2.orderSection) {
        return -1;
    }
    return 0;
    });
  }

  previousState(): void {
    window.history.back();
  }

  truncate = (input) => input.length > 20 ? `${input.substring(0, 20)}...` : input;

  onLoadDetailSection(ressource: IResource, sectionResourceId:number, index: number, scrollToSection: boolean) {
    
    forkJoin([
      this.ressourceStatsLectureVideoService.query({'idResource.equals': this.resource.id}).pipe(map(result => result.body)),
      this.fileService.query({ 'sectionResourceId.equals': sectionResourceId, 'applicationDataId.equals': this.applicationData.id}).pipe(map(result => result.body)),
      this.lecteurSeriesService.query({ 'sectionResourceId.equals': sectionResourceId, 'typeLecteurEnum.equals': 'VIDEO', 'sort': ['order,asc'] }).pipe(map(result => result.body)),
      this.lecteurSeriesService.query({ 'sectionResourceId.equals': sectionResourceId, 'typeLecteurEnum.equals': 'AUDIO', 'sort': ['order,asc'] }).pipe(map(result => result.body)),
      
    ]).subscribe(data => {
      
        console.log('data', data);
        this.currentTimePlayerVideo = 0;
        this.currentTimePlayerAudio = 0;

        const statsLectureVideoOnDB = data[0];
        if(statsLectureVideoOnDB.length == 1){
          this.ressourceStatsLectureVideo = statsLectureVideoOnDB[0];
          if(this.ressourceStatsLectureVideo)
          this.statsLectureVideo = JSON.parse(this.ressourceStatsLectureVideo.statsLectureVideo);
        }
        console.log('statsLectureVideo : ', this.statsLectureVideo);
        
        this.files = data[1];
        console.log('Sections Files : ', this.files);

        this.lecteurVideoSeries = this.applyStatsLecture(data[2],  this.statsLectureVideo, sectionResourceId);
        console.log('Sections Lecteur Video : ', this.lecteurVideoSeries);
        if (this.lecteurVideoSeries && this.lecteurVideoSeries.length > 0) {
          if(!this.currentVideo){
            this.currentVideo = this.lecteurVideoSeries[0];
          }
        }

        this.lecteurAudioSeries= this.applyStatsLecture(data[3],  this.statsLectureVideo,sectionResourceId);
        console.log('Sections Lecteur Audio : ', this.lecteurAudioSeries);
        if (this.lecteurAudioSeries && this.lecteurAudioSeries.length > 0) {
          if(!this.currentAudio){
            this.currentAudio = this.lecteurAudioSeries[0];
          }
          
          
        }

        
        if(scrollToSection) {
          setTimeout(() => {
            this.scrollToLabel('accordionId-' + index), 300;
            this.numberPanelSelected = index;
          },300);
        }
        
    });
  
  }

  isAuthorize(ressource: IResource) {
    let authorize = false;
    const userConnectedRoles = this._authService.getRoles();
    if(userConnectedRoles){
        const listUserConnectedRoles = userConnectedRoles.split(',');
        console.log('userConnectedRoles : ', listUserConnectedRoles);
        console.log('ressources.roles : ', ressource.roles.map(role => role.name));
        
        if(listUserConnectedRoles.some(roles => ressource.roles.map(role => role.name).indexOf(roles.substring(roles.indexOf('::')+2, roles.length)) >= 0)){
          authorize = true;
        }
    }
    return authorize;
  }

  applyStatsLecture(medias: ILecteurSeries[], statsLectureVideo: StatsLectureVideo, sectionResourceId: number): ILecteurSeries[] {
    if(statsLectureVideo && statsLectureVideo.sections && statsLectureVideo.sections.length > 0){
      var listSectionFiltredByActualSection = statsLectureVideo.sections.filter(section => section.idSection == sectionResourceId);
      if(listSectionFiltredByActualSection.length > 0){
        medias.forEach(media => {
          if(listSectionFiltredByActualSection[0].idVideosFinished.includes(media.id)){
            media.endReaded = true;
          }
        });
      }
    }
    console.log('after apply StatsLecture : ', medias);
    return medias;
  }

  onSwiperSlideClick(lecteur: ILecteurSeries){
    console.log('Click on Slide Video/Audio', lecteur);
    this.notTriggerPlaybackEnded = true;
    if(lecteur.typeLecteurEnum =='AUDIO'){
      this.currentTimePlayerAudio = 0;
      this.currentAudio = lecteur;
    }
    if(lecteur.typeLecteurEnum =='VIDEO'){
      this.currentTimePlayerVideo = 0;
      this.currentVideo = lecteur;
    }
  }

  scrollToLabel(label) {
    var titleELe = document.getElementById(label);
    console.log('label', titleELe);
    console.log(' titleELe.offsetTop',  titleELe.offsetTop);
    this.content.scrollToPoint(0, titleELe.offsetTop, 1000);
  }

  goToEditResource() {
    this.router.navigate(this.resource.typeResourceEnum == 'RESSOURCE' ?['/apps/ressources/resources', this.resource.id, 'edit']:['/apps/ressources/formations', this.resource.id, 'edit']);
  }

  async presentAlertDeleteSection(section : SectionResource){
    const alert = await this.alertController.create({
      header: 'Êtes vous sûr de vouloir supprimer cette section ?',
      subHeader: 'Les Fichiers/ Vidéos / Audios associés seront également supprimés',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('suppression Section canceled'); }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { 
            console.log('delete section : ', section);
            this.files.forEach(file => {
              this.fileService.delete(file.id).subscribe(()=>console.log('fichier supprimé : ',file.filename));
            });
            this.lecteurVideoSeries.forEach(lecteurSerie => {
              this.lecteurSeriesService.delete(lecteurSerie.id).subscribe(()=>console.log('lecteurSerie Video supprimé', lecteurSerie.titre));
            });
            this.lecteurAudioSeries.forEach(lecteurSerie => {
              this.lecteurSeriesService.delete(lecteurSerie.id).subscribe(()=>console.log('lecteurSerie Audio supprimé', lecteurSerie.titre));
            });
            this.sectionResourceService.delete(section.id).subscribe(async() => {
              console.log('Section supprimée');
              this.loadSectionsResource();
              const toast = await this.toastController.create({
                message: 'La section a été supprimée.',
                duration: 2000
              });
              toast.present();
            }); 
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertDeleteResource(id : number){
    if(this.sectionsResource.length > 0 ){
      const alert = await this.alertController.create({
        header: 'Veuillez au préalable supprimer toutes les sections.',
        buttons: [
          {
            text: 'Ok',
            role: 'confirm',
            handler: () => { console.log('Alert suppressiion au préalable des Sections'); }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Êtes vous sûr de vouloir supprimer cette ressource ?',
        subHeader: 'Les Sections / Fichiers / Vidéos / Audios associés seront également supprimés',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { console.log('suppressiion Ressource canceled'); }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => { 
              this.resourceService.delete(id).subscribe(async() => {
                console.log('Ressource supprimée');
                this.router.navigate(this.resource.typeResourceEnum == 'RESSOURCE' ?['/apps/ressources/resources']:['/apps/ressources/formations']);
                const toast = await this.toastController.create({
                  message: 'La ressource a été supprimée.',
                  duration: 2000
                });
                toast.present();
              }); 
            }
          }
        ]
      });
      await alert.present();
    }
    
  }

  async presentAlertDeleteFile(idFile : number, idSection: number){
    const alert = await this.alertController.create({
      header: 'Êtes vous sûr de vouloir supprimer ce fichier ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('suppression File canceled'); }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { 
            this.fileService.delete(idFile).subscribe(async() => {
              console.log('Fichier supprimé');
              this.onLoadDetailSection(this.resource, idSection, this.numberPanelSelected, false);
              const toast = await this.toastController.create({
                message: 'Le fichier a été supprimée.',
                duration: 2000
              });
              toast.present();
            }); 
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDeleteMedia(idMedia : number, idSection: number){
    const alert = await this.alertController.create({
      header: 'Êtes vous sûr de vouloir supprimer ce Média ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('suppression Média canceled'); }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { 
            this.lecteurSeriesService.delete(idMedia).subscribe(async() => {
              console.log('Media supprimé');
              this.onLoadDetailSection(this.resource, idSection, this.numberPanelSelected, false);
              const toast = await this.toastController.create({
                message: 'Le Média a été supprimée.',
                duration: 2000
              });
              toast.present();
            }); 
          }
        }
      ]
    });
    await alert.present();
  }

  onPlaybackReady() {
    
  }

  isIncludedBookmark(resource: IResource){
    return this.applicationData?.resourcesBookmarks.map(res => res.id).includes(resource.id);
  }

  isIncludedShared(resource: IResource, appData: IApplicationData){
    return appData.resourcesSharedWithYous.map(res => res.id).includes(resource.id);
  }

  addRessourceToBookmark(resource: IResource){
    if(!this.isIncludedBookmark(resource)){
      this.applicationData?.resourcesBookmarks.push(resource);
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

  getHref(){  
    return window.location.href;
  }

  onPlaybackEnded(event, section: ISectionResource, idVideoAudio: number){
    console.log('The video {0} is ended. His section is : {1}', this.currentVideo, section, event);
    if(!this.notTriggerPlaybackEnded) {
      
      this.currentTimePlayerVideo = 0;
      this.currentTimePlayerAudio = 0;
      this.statsLectureVideo = this.addVideoOnStatsLectureVideo(this.statsLectureVideo, section.id, idVideoAudio);
      if(!this.ressourceStatsLectureVideo){
        const ressourceStatsLectureVideo = new RessourceStatsLectureVideo();
        ressourceStatsLectureVideo.applicationData = this.applicationData;
        ressourceStatsLectureVideo.idResource = this.resource.id;
        ressourceStatsLectureVideo.statsLectureVideo = JSON.stringify(this.statsLectureVideo);
        ressourceStatsLectureVideo.creationDate = dayjs().startOf('day');
        ressourceStatsLectureVideo.updatedDate = dayjs().startOf('day');
        this.ressourceStatsLectureVideoService.create(ressourceStatsLectureVideo).subscribe(() => {
          this.onLoadDetailSection(this.resource, section.id, this.numberPanelSelected, false);
          console.log('Creation d\'une nouvelle ressourceStatsLectureVideoService : ', this.ressourceStatsLectureVideoService);
        })
      }else{
        this.ressourceStatsLectureVideo.statsLectureVideo = JSON.stringify(this.statsLectureVideo);
        this.ressourceStatsLectureVideo.updatedDate = dayjs().startOf('day');
        this.ressourceStatsLectureVideoService.update(this.ressourceStatsLectureVideo).subscribe(() => {
          this.onLoadDetailSection(this.resource, section.id, this.numberPanelSelected, false);
          console.log('MAJ de la ressourceStatsLectureVideoService : ', this.ressourceStatsLectureVideoService);
        });
      }
    }
    
  }
  

  addVideoOnStatsLectureVideo(statsLectureVideo: StatsLectureVideo, idSectionToAdd: number, idVideoToAdd: number): IStatsLectureVideo{
    if(statsLectureVideo == null){
      statsLectureVideo = new StatsLectureVideo();
    }
    if(statsLectureVideo.sections == null){
      statsLectureVideo.sections = []
    }
    if(statsLectureVideo.sections.filter(_section => _section.idSection == idSectionToAdd).length == 0){
      // Section non existante dans statsLectureVideo => On la créée
      var sectionStats = new SectionStats();
      sectionStats.idSection = idSectionToAdd;
      sectionStats.idVideosFinished = [];
      statsLectureVideo.sections.push(sectionStats);
    }
    var sectionStatsToAdd = statsLectureVideo.sections.filter(_section => _section.idSection == idSectionToAdd)[0];
    if(sectionStatsToAdd.idVideosFinished.filter(_idVideo => _idVideo == idVideoToAdd).length == 0){
      // Video non existante dans statsLectureVideo => On l'ajoute
      sectionStatsToAdd.idVideosFinished.push(idVideoToAdd);
    }
    return statsLectureVideo;
  }

  onStart(event: CustomEvent<any>){
    console.log('On start ', event);
    this.notTriggerPlaybackEnded = false;
  }

  demandeAutorisation(ressource: IResource){
    this.demandeAccesFormationPriveeService.query({'idRessourceToActive.equals':ressource.id, 'idDemandeur.equals':this.connectedMembre.id})
    .subscribe(async(result)=> {
      var demandes = result.body;
      if(demandes.length > 0){
        const toast = await this.toastController.create({
          message: 'Une demande est déjà en cours pour cette ressource.', 
          duration: 4000
        });
        toast.present();
      } else {
        var demandeAccesFormationPrivee: DemandeAccesFormationPrivee = new DemandeAccesFormationPrivee();
        demandeAccesFormationPrivee.idDemandeur = this.connectedMembre.id;
        demandeAccesFormationPrivee.nomDemandeur = this.connectedMembre.internalUser.firstName;
        demandeAccesFormationPrivee.prenomDemandeur = this.connectedMembre.internalUser.lastName;
        demandeAccesFormationPrivee.idRessourceToActive = ressource.id;
        demandeAccesFormationPrivee.nomRessourceToActive = ressource.title;
        demandeAccesFormationPrivee.creationDate = dayjs();
        demandeAccesFormationPrivee.updatedDate = dayjs();
        this.demandeAccesFormationPriveeService.create(demandeAccesFormationPrivee)
        .subscribe(async()=> {
          const toast = await this.toastController.create({
            message: 'Une demande a été effectuées auprès des admministrateurs. Si elle est acceptée, vous revcevrez un mail d\'information', 
            duration: 4000
          });
          toast.present();
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: 'Une erreur s\'est produite', 
            duration: 4000
          });
          toast.present();
        });
      }
    })
  }
}

