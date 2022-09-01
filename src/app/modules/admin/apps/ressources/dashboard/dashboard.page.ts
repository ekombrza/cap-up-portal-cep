import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { IApplication } from 'src/app/models-services/application/application.model';
import { ApplicationService } from 'src/app/models-services/application/application.service';
import { IMembre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject<any>();
  connectedMembre: IMembre | null = null;
  applicationRessource: IApplication | null = null;
  applicationData: IApplicationData | null = null;

  constructor(
    protected membreService: MembreService,
    protected applicationService: ApplicationService,
    protected applicationDataService: ApplicationDataService,
  ) { }

  ngOnInit() {
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
          console.log('application-data dashboad parent : ',this.applicationData);
        },
        error: () => {
        },
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

}
