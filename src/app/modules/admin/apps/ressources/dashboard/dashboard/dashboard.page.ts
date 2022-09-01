import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { ScaleType } from '@swimlane/ngx-charts';
import { map, takeUntil } from 'rxjs/operators';
import { groupBy } from 'src/@ekbz/services/utils';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { ApplicationService } from 'src/app/models-services/application/application.service';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { ResourceService } from 'src/app/models-services/ressource/resource.service';
import { RessourceStatsLectureVideoService } from 'src/app/models-services/statistiquesLectureVideo/ressourceStatsLectureVideo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject<any>();
  applicationData: IApplicationData | null = null;
  groupsCategories: Map<string, any> | [] = [];

  view: [number, number] = [150, 150];

  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#edf2f1', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };


  constructor(
    protected resourceService: ResourceService,
    protected membreService: MembreService,
    protected applicationService: ApplicationService,
    protected applicationDataService: ApplicationDataService,
    protected ressourceStatsLectureVideoService: RessourceStatsLectureVideoService,
  ) { }

  ngOnInit() {
    
      this.applicationDataService.getApplicatioNDataObs(null,  null, false)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res: IApplicationData) => {
          this.applicationData = res;
          console.log('application-data dashboard : ',this.applicationData);
          if(this.applicationData){
            this.applicationData.resourcesVieweds.forEach(ressource => {
              forkJoin([
                this.resourceService.getNbTotalVideos(ressource.id),
                this.ressourceStatsLectureVideoService.query({'idResource.equals': ressource.id}).pipe(map(result => result.body)),
              ]).subscribe(data => {
                  console.log('ressource : ' + ressource.id + 'nbTotalVideo :', data[0].nbTotalVideo);
                  ressource['nbTotalVideo']= data[0].nbTotalVideo;

                  console.log('statsLectureVideo :', data[1]);
                  var nbVideoLues = 0;
                  if(data[1].length == 1){
                    var statsLectureVideo = JSON.parse(data[1][0].statsLectureVideo);
                    statsLectureVideo.sections.forEach(section => {
                      nbVideoLues = nbVideoLues + section.idVideosFinished.length;
                    })
                  }
                  console.log('ressource : ' + ressource.id + 'nbTotalVideoLues :', nbVideoLues);
                  ressource['nbTotalVideoLues']= [{name: '', value: nbVideoLues}] ;
                })
            });
            this.groupsCategories = groupBy(this.applicationData.resourcesVieweds, x => x.categories)
            console.log('grouped ressources viewed : ', this.groupsCategories);
          }
          
        },
        error: () => {
        },
      });
  }
  

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }


}
