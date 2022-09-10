import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertType } from 'src/@ekbz/components/alert';
import { Church } from 'src/app/models-services/church/church.model';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { RegisterService } from 'src/app/models-services/register/register.service';
import { Role } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';
import { User } from 'src/app/models-services/user/user.model';
import { AuthService } from 'src/app/models-services/auth/auth.service';
const USER_ALREADY_USED_TYPE = 'error.userexists';

@Component({
  selector: 'app-church-invitation',
  templateUrl: './church-invitation.page.html',
  styleUrls: ['./church-invitation.page.scss'],
})
export class ChurchInvitationPage implements OnInit {
  success: boolean;
  error: string;
  errorEmailExists: string;
  errorUserExists: string;
  adminUser : User;
  invitedMembre: Membre;
  listRoles: Role[];
  listRolesSelected: Role[];
  
  alert: { type: AlertType; message: string } = {
    type   : 'success',
    message: ''
  };
  showAlert: boolean = false;


  invitationForm = this.fb.group({
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    roles: [[], [Validators.required]],
    email: ['', [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private roleService: RoleService,
    private registerService: RegisterService,
    private authenticationService: AuthService,
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.success = false;

    this.roleService.query({
      'applicationId.equals':'1',
      'typeRole.equals':'PUBLIC'
    }).subscribe(data => {
      this.listRoles = data.body;
      console.log('listRoles = ', this.listRoles);
    });
  }

  initializeForm() {
    console.log('Initialize form...');
    this.invitationForm.patchValue({
      lastName: this.adminUser.lastName,
      firstName: this.adminUser.firstName,
      roles: this.invitedMembre.roles,
      email: this.adminUser.email,
    })
  }

  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) { 
    return f1 && f2 && f1.name === f2.name; 
  }

  navigateback(){
    this.router.navigateByUrl('/admin/church');
    
  }

  sendInvitation(){
    let adminUserDTO = {};
    console.log('update profil)');
    const lastName = this.invitationForm.get(['lastName']).value;
    const firstName = this.invitationForm.get(['firstName']).value;
    const email = this.invitationForm.get(['email']).value;
    const login = email;
    const password = "changeItWithChangeProcess";

    adminUserDTO = { ...adminUserDTO, lastName, firstName, login, email, password };
    adminUserDTO = { ...adminUserDTO, langKey: 'fr' };

    let church:Church = {};
    var churchId = this.authenticationService.getChurch();
    church.id = churchId;

    let membreDTO = {};
    const inAppNotification:boolean = true;
    const emailNotification:boolean = true;
    const phoneNumber:string = "";
    const jobStatus:string = "INVITED";
    const roles = this.invitationForm.get(['roles']).value;
    membreDTO = { ...membreDTO, phoneNumber, inAppNotification, emailNotification, jobStatus, church, roles };

    let account = {};
    account = { ...account, adminUserDTO, membreDTO, password};

    this.error = null;
    this.errorUserExists = null;
    this.errorEmailExists = null;

    this.registerService.saveForOther(account).subscribe(
      () => {
        this.success = true;
        this.presentToast('L\'invitation a été envoyée par mail.', 'success'); 
        this.router.navigateByUrl('/admin/church?reload=true');
      },
      response => {
        this.processError(response);
        this.presentToast('Erreur lors de l\'envoi de l\'invitation', 'danger'); 
      },
      // () => this.loader.dismiss()
    );
  }

  private processError(response: HttpErrorResponse) {
    this.success = null;
    if ((response.status === 400 && response.error.message === USER_ALREADY_USED_TYPE)) {
        // Set the alert
        this.alert = {
            type   : 'error',
            message: 'L\'utilisateur existe déjà. Veuillez réessayer.'
        };
    } else {
        // Set the alert
        this.alert = {
            type   : 'error',
            message: 'Une erreur s\'est produite. Veuillez réessayer.'
        };
    }
    console.log('error signup');

    // Show the alert
    this.showAlert = true;
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
