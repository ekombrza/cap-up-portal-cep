import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge , of as observableOf} from 'rxjs';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { ITEMS_PER_PAGE } from 'src/constantes/pagination.constants';
import { Membre } from 'src/app/models-services/membre/membre.model';

@Component({
  selector: 'app-church-responsables',
  templateUrl: './church-responsables.component.html',
  styleUrls: ['./church-responsables.component.scss'],
})
export class ChurchResponsablesComponent implements OnInit {

  constructor(
    private membreService: MembreService) { }

  ngOnInit() {}

  itemsPerPage = ITEMS_PER_PAGE;

  displayedColumnsMembre: string[] = ['internalUser.login', 'roles', 'statut', 'email'];

  dataResult: Membre[] = [];

  resultsLength = '0';
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngAfterViewInit() {
    
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.membreService.query({
          page: this.paginator.pageIndex,
          size: this.itemsPerPage,
          sort: this.sortingString(),
          eagerload: false,
          'jobStatus.equals': 'ACTIVE'
        }).pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        console.log('membres data = ' , data);
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;

        if (data === null) {
          return [];
        }

        // Only refresh the result length if there is new data. In case of rate
        // limit errors, we do not want to reset the paginator to zero, as that
        // would prevent users from re-triggering requests.
        this.resultsLength = data.headers.get('X-Total-Count');
        console.log('X-Total-Count: ', this.resultsLength);
        return data.body;
      }),
    )
    .subscribe(data => (this.dataResult = data));
  }

  sortingString(): string[] {
    const result = [this.sort.active + ',' + (this.sort.direction)];
    if (this.sort.active !== 'id') {
      result.push('id');
    }
    return result;
  }
}
