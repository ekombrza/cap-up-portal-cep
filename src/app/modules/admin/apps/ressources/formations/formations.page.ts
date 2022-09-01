import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ICategorie } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';


@Component({
  selector: 'app-formations',
  templateUrl: './formations.page.html',
  styleUrls: ['./formations.page.scss'],
})
export class FormationsPage implements OnInit {

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
