import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { ApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { FileService } from 'src/app/models-services/file/file.service';
import { Resource } from 'src/app/models-services/ressource/resource.model';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';
import { SectionResourceService } from 'src/app/models-services/section-ressource/section-resource.service';
import { PdfLectureStats } from 'src/app/models-services/statistiquesLectureVideo/PdfLectureStats.model';
import { RessourceStatsLectureVideo } from 'src/app/models-services/statistiquesLectureVideo/ressource-stats-lecture-video.model';
import { RessourceStatsLectureVideoService } from 'src/app/models-services/statistiquesLectureVideo/ressourceStatsLectureVideo.service';
import { IStatsLectureVideo, StatsLectureVideo } from 'src/app/models-services/statistiquesLectureVideo/StatsLectureVideo.model';

@Component({
  selector: 'app-pdf-view-page',
  templateUrl: './pdf-view-page.page.html',
  styleUrls: ['./pdf-view-page.page.scss'],
})
export class PdfViewPagePage implements OnInit {

  private unsubscribe$: Subject<any> = new Subject<any>();

  pdfSrc;
  currentResource: Resource ;
  applicationData: ApplicationData;
  totalPages: number;
  currentPage: number;
  initCurrentPage: number = 1;
  initPageDone = false;
  ressourceStatsLectureVideo: any;
  statsLectureVideo: StatsLectureVideo;

  constructor(
    protected sectionResourceService: SectionResourceService,
    protected resourceService: ResourceService,
    protected fileService: FileService,
    protected ressourceStatsLectureVideoService: RessourceStatsLectureVideoService,
    protected applicationDataService: ApplicationDataService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ resource }) => {
    console.log('resource : ', resource);
    this.currentResource = resource;

    forkJoin([
      this.ressourceStatsLectureVideoService.query({'idResource.equals': this.currentResource.id}).pipe(map(result => result.body)),
      this.fileService.query({ 'resourceId.equals': this.currentResource.id}).pipe(map(result => result.body))
    ])
    .subscribe((data) => {
      const statsLectureVideoOnDB = data[0];
        if(statsLectureVideoOnDB.length == 1){
          this.ressourceStatsLectureVideo = statsLectureVideoOnDB[0];
          if(this.ressourceStatsLectureVideo)
            this.statsLectureVideo = JSON.parse(this.ressourceStatsLectureVideo.statsLectureVideo);
            if(this.statsLectureVideo && this.statsLectureVideo.pdfLecture){
              this.initCurrentPage = this.statsLectureVideo.pdfLecture.currentPage;
              console.log('initCurrentPage : ', this.initCurrentPage);
            }
        }
        console.log('statsLectureVideo : ', this.statsLectureVideo);
        console.log('files : ', data[1]);
        this.pdfSrc = data[1][0].filePathName;
    
    });
  });

  this.applicationDataService.getApplicatioNDataObs(null,  null, false)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((applicationData) => {
      this.applicationData = applicationData;
    });
  }

  afterLoadComplete(pdf): void {
    this.totalPages = pdf.numPages;
    console.log("total page ", this.totalPages, pdf);
  }

  pageRendered(event){
    if(!this.initPageDone){
      this.initPageDone = true;
      this.changePage(this.initCurrentPage);
    }
  
  }

  changePage(page){
    this.currentPage = page;
  }

  addVideoOnStatsLectureVideo(statsLectureVideo: StatsLectureVideo, currentPage: number, totalPages: number): IStatsLectureVideo{
    if(statsLectureVideo == null){
      statsLectureVideo = new StatsLectureVideo();
    }

    if(statsLectureVideo.pdfLecture  == null){
      statsLectureVideo.pdfLecture = new PdfLectureStats();
    }

    statsLectureVideo.pdfLecture.currentPage = currentPage;
    statsLectureVideo.pdfLecture.totalPage = totalPages;
    
    return statsLectureVideo;
  }

  onQuit() {
    this.statsLectureVideo = this.addVideoOnStatsLectureVideo(this.statsLectureVideo, this.currentPage, this.totalPages);
    if(!this.ressourceStatsLectureVideo){
      const ressourceStatsLectureVideo = new RessourceStatsLectureVideo();
      ressourceStatsLectureVideo.applicationData = this.applicationData;
      ressourceStatsLectureVideo.idResource = this.currentResource.id;
      ressourceStatsLectureVideo.statsLectureVideo = JSON.stringify(this.statsLectureVideo);
      ressourceStatsLectureVideo.creationDate = dayjs().startOf('day');
      ressourceStatsLectureVideo.updatedDate = dayjs().startOf('day');
      this.ressourceStatsLectureVideoService.create(ressourceStatsLectureVideo).subscribe(() => {
        console.log('Creation d\'une nouvelle ressourceStatsLectureVideoService : ', this.ressourceStatsLectureVideo);
      })
    }else{
      this.ressourceStatsLectureVideo.statsLectureVideo = JSON.stringify(this.statsLectureVideo);
      this.ressourceStatsLectureVideo.updatedDate = dayjs().startOf('day');
      this.ressourceStatsLectureVideoService.update(this.ressourceStatsLectureVideo).subscribe(() => {
        console.log('MAJ de la ressourceStatsLectureVideoService : ', this.ressourceStatsLectureVideo);
      });
    }
    this.router.navigate(['/apps/ressources/formations', this.currentResource.id, 'view']);
    //[routerLink]="['/apps/ressources/formations', currentResource.id, 'view']"
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
