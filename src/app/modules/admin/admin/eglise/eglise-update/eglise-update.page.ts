import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AdressService } from 'src/app/models-services/adress/adress-service';
import { Adress } from 'src/app/models-services/adress/adress.model';
import { Church } from 'src/app/models-services/church/church.model';
import { ChurchService } from 'src/app/models-services/church/church.service';
import { Country } from 'src/app/models-services/country/country.model';
import { CountryService } from 'src/app/models-services/country/country.service';
import { Denomination } from 'src/app/models-services/denomination/denomination.model';
import { DenominationService } from 'src/app/models-services/denomination/denomination.service';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';


@Component({
  selector: 'app-eglise-update',
  templateUrl: './eglise-update.page.html',
  styleUrls: ['./eglise-update.page.scss'],
})
export class EgliseUpdatePage implements OnInit {
  success: boolean;
  error: string;
  church : Church;
  adress: Adress;
  connectedMembre: Membre;
  listDenominations: Denomination[];
  listCountry: Country[];


  churchForm = this.fb.group({
    churchName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    pastorName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    phoneNumber:['', [Validators.minLength(1), Validators.maxLength(13), Validators.pattern('^[ +_.@a-zA-Z0-9- ]*$')]],
    email: ['', [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    website: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[:/_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    denomination: [[], [Validators.required]],
    adress1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    adress2: ['', [Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    region: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    postalCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    country: [[], [Validators.required]],
  });


  constructor(
    private fb: UntypedFormBuilder,
    private churchService: ChurchService,
    private membreService: MembreService,
    private adressService: AdressService,
    private denominationService: DenominationService,
    private countryService: CountryService,
    public toastController: ToastController,
    private router: Router) { }


  ngOnInit() {
    this.success = false;

    this.membreService.queryCurrentUser().subscribe(data => {
      this.connectedMembre = data.body;
      console.log(this.connectedMembre);
      
      this.churchService.find(this.connectedMembre.church.id).subscribe(data => {
        this.church = data.body;
        console.log('church = ', this.church);
        
        this.adressService.find(this.church.adress.id).subscribe(data => {
          this.adress = data.body;
          console.log('adress = ', this.adress);

            this.denominationService.query().subscribe(data => {
              this.listDenominations = data.body;
              console.log('listDenominations = ', this.listDenominations);

              this.countryService.query().subscribe(data => {
                this.listCountry = data.body;
                console.log('listCountry = ', this.listCountry);
              })
              this.initializeForm();

          });
        });
      });
    });
  }

  initializeForm() {
    console.log('Initialize form...');
    this.churchForm.patchValue({
      churchName: this.church.churchName,
      pastorName: this.church.pastorName,
      phoneNumber: this.church.phoneNumber,
      email: this.church.email,
      website: this.church.website,
      denomination: this.church.denomination,
      adress1: this.adress.adress1,
      adress2: this.adress.adress2,
      city: this.adress.city,
      region: this.adress.region,
      postalCode: this.adress.postalCode,
      country: this.adress.country
    })
}

  updateChurch(){
    console.log('update church)');
    this.updateChurchEntity(this.church);
    this.updateAdressEntity(this.adress);
    if (this.church.id !== undefined) {
      this.churchService.update(this.church).subscribe(
        () => {
          this.onSaveSuccess();
          if (this.adress.id !== undefined) {
            this.adressService.update(this.adress).subscribe(
              () => {
                this.onSaveSuccess();
                this.presentToast('Enregistrement sauvegardé !', 'success');
                this.navigateback();
              },
              (err) => {
                this.onSaveError("Erreur lors de la sauvegarde des infos d'adresse. ",err);
                this.presentToast('Erreur lors de la sauvegarde des infos d\'adresse', 'error');
              }
            );
          }
        },
        (err) => {
          this.onSaveError("Erreur lors de la sauvegarde des infos d'église. ",err);
          this.presentToast('Erreur lors de la sauvegarde des infos d\'église', 'error');
        }
      );
      
    }
    
  }

  private updateChurchEntity(church: Church): void {
    church.churchName = this.churchForm.get(['churchName'])!.value;
    church.pastorName = this.churchForm.get(['pastorName'])!.value;
    church.phoneNumber = this.churchForm.get(['phoneNumber'])!.value;
    church.email = this.churchForm.get(['email'])!.value;
    church.website = this.churchForm.get(['website'])!.value;
    church.denomination = this.churchForm.get(['denomination'])!.value;
  }

  private updateAdressEntity(adress: Adress): void {
    adress.adress1 = this.churchForm.get(['adress1'])!.value;
    adress.adress2= this.churchForm.get(['adress2'])!.value;
    adress.city = this.churchForm.get(['city'])!.value;
    adress.region = this.churchForm.get(['region'])!.value;
    adress.postalCode = this.churchForm.get(['postalCode'])!.value;
    adress.country = this.churchForm.get(['country'])!.value;
  }
  
  private onSaveSuccess(): void {
    this.success = true;
    this.error = "";
  }

  private onSaveError(message , error): void {
    console.log('error:' ,error);
    this.error = message;
    if(error.error.errorKey === 'emailexists') {
      this.error += "L'email est déjà utilisé.";
    }
    this.success = false;
    
  }

  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) { 
    return f1 && f2 && f1.name === f2.name; 
  }

  navigateback(){
    this.router.navigateByUrl('/admin/church');
    
  }

  async presentToast(message: string, color: string ) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: color,
      duration: 2000
    });
    toast.present();
  }

}