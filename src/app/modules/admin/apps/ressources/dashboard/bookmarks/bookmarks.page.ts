import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { groupBy } from 'src/@ekbz/services/utils';
import { IApplicationData } from 'src/app/models-services/application-data/application-data.model';
import { ApplicationDataService } from 'src/app/models-services/application-data/application-data.service';
import { ApplicationService } from 'src/app/models-services/application/application.service';
import { MembreService } from 'src/app/models-services/membre/membre.service';


@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject<any>();
  applicationData: IApplicationData | null = null;
  groupsCategories: Map<string, any> | [] = [];

  constructor(    
    protected membreService: MembreService,
    protected applicationService: ApplicationService,
    protected applicationDataService: ApplicationDataService,
  ) {} 


  ngOnInit() {   
    this.applicationDataService.getApplicatioNDataObs(null,  null, false)
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe({
      next: (res: IApplicationData) => {
        this.applicationData = res;
        console.log('application-data bookmark: ',this.applicationData);
        if(this.applicationData){
          this.groupsCategories = groupBy(this.applicationData.resourcesBookmarks, x => x.categories)
          console.log('grouped ressources bookmarked : ', this.groupsCategories)
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
