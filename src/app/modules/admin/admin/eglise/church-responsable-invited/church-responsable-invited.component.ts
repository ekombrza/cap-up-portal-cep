import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertController, ToastController } from '@ionic/angular';
import { merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { RegisterService } from 'src/app/models-services/register/register.service';
import { ITEMS_PER_PAGE } from 'src/constantes/pagination.constants';


@Component({
  selector: 'app-church-responsable-invited',
  templateUrl: './church-responsable-invited.component.html',
  styleUrls: ['./church-responsable-invited.component.scss'],
})
export class ChurchResponsableInvitedComponent implements OnInit {

  constructor(private membreService: MembreService,
    private alertController: AlertController,
    private toastController: ToastController,
    private registerService: RegisterService,) { }
  
  ngOnInit() {}

  itemsPerPage = ITEMS_PER_PAGE;

  displayedColumnsMembre: string[] = ['internalUser.login', 'roles', 'email', 'supprimer', 'resendMail'];

  dataResult: Membre[] = [];
  private _reload: boolean;

  resultsLength = '0';
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() set reload(value: boolean){
    if(value){
      console.log('value of reload : ',value)
      this.loadData();
      this.dataLoaded.emit(true);
    }
  }
  @Output() dataLoaded = new EventEmitter<boolean>();

  ngAfterViewInit() {

    this.loadData();
  }

  private loadData() {
        
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
            'jobStatus.equals': 'INACTIVE'
          }).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          console.log('inactive membres data = ', data);
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
        })
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

  delete(membre: Membre){
    console.log('delete membre :', membre);
    this.membreService.delete(membre.id).subscribe(()=> {
      this.loadData();
    });
  
  }

  resendMail(membre: Membre){
    console.log('resend mail membre :', membre);
     this.registerService.resendEmail(membre.internalUser.login).subscribe(
      () => {
        this.presentToast('Le mail a été envoyé.', 'success'); 
      },
      response => {
        this.presentToast('Erreur lors de l\'envoi du mail', 'danger'); 
      },
      // () => this.loader.dismiss()
    );
  }

  async presentAlertConfirm(membre: Membre, type: String) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation!',
      message: 'Êtes-vous sûr de la <strong> suppression ce membre </strong>?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          //id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          //id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            if(type == 'delete') {
              this.delete(membre);
              this.presentToast('Le membre a été supprimé', 'success');
            }
            
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(messageString: string, color: string) {
    const toast = await this.toastController.create({
      message: messageString,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
