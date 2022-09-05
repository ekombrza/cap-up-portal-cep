import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs';
import { ICategorie } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    styleUrls: ['./home.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit {

    categories?: ICategorie[];
    constructor(
      private categorieService: CategorieService,
    ) { }
  
    ngOnInit() {
      this.categorieService.getCategoriesWithFourResources()
        .pipe(map(result => result.body))
        .subscribe((categories) => {
          this.categories = categories;
          console.log('categories : ', this.categories)
        },
        error => {
  
        } 
      )}
  
  }