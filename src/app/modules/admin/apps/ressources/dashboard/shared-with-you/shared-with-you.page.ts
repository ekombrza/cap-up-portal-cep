import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { groupBy } from 'src/@ekbz/services/utils';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';


@Component({
  selector: 'app-shared-with-you',
  templateUrl: './shared-with-you.page.html',
  styleUrls: ['./shared-with-you.page.scss'],
})
export class SharedWithYouPage implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject<any>();
  applicationData: IApplicationData | null = null;
  groupsCategories: Map<string, any> | [] = [];

  constructor(
    protected applicationDataService: ApplicationDataService,
  ) { }

  ngOnInit() {
      this.applicationDataService.getApplicatioNDataObs(null,  null, false)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res: IApplicationData) => {
          this.applicationData = res;
          console.log('application-data share with you: ',this.applicationData);

          if(this.applicationData){
            this.groupsCategories = groupBy(this.applicationData.resourcesSharedWithYous, x => x.categories)
            console.log('grouped ressources shared whith me : ', this.groupsCategories)
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
