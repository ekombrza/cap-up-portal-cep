import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ICategorie } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

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
      private router: Router
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
  
      goToFormation(formationId) {
        this.router.navigate(['/apps/ressources/formations', formationId, 'view']);
      }
  }