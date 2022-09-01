import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { Role } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';
import { AdminUserService } from 'src/app/models-services/user/admin-user.service';
import { PasswordService } from 'src/app/models-services/user/password.service';
import { User } from 'src/app/models-services/user/user.model';

@Component({
  selector: 'app-profil-update',
  templateUrl: './profil-update.page.html',
  styleUrls: ['./profil-update.page.scss'],
})
export class ProfilUpdatePage implements OnInit {
  success: boolean;
  error: string;
  doNotMatch: boolean;
  adminUser : User;
  connectedMembre: Membre;
  listRoles: Role[];
  listRolesSelected: Role[];

  profilForm = this.fb.group({
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    phoneNumber:['', [Validators.minLength(1), Validators.maxLength(13), Validators.pattern('^[ _.@a-zA-Z0-9- ]*$')]],
    roles: [[], [Validators.required]],
    email: ['', [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
    currentPassword: ['', [Validators.minLength(8), Validators.maxLength(50)]],
    password: ['', [Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.minLength(8), Validators.maxLength(50)]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.minLength(4), Validators.maxLength(50)]],
    password: ['', [Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.minLength(8), Validators.maxLength(50)]],
  });

  constructor(private fb: UntypedFormBuilder,
    private roleService: RoleService,
    private membreService: MembreService,
    private adminUserService: AdminUserService,
    private passwordService: PasswordService,
    private router: Router) { }


  ngOnInit() {
    this.success = false;

    this.roleService.query({
      'applicationId.equals':'1',
      'typeRole.equals':'PUBLIC'
    }).subscribe(data => {
      this.listRoles = data.body;
      console.log('listRoles = ', this.listRoles);

      this.membreService.queryCurrentUser().subscribe(data => {
        this.connectedMembre = data.body;
        console.log('connectedMembre : ', this.connectedMembre);

        this.adminUserService.query().subscribe(data => {
          this.adminUser = data.body;
          console.log(this.adminUser);

          this.initializeForm();
        });
      });

    });
  }

  initializeForm() {
    console.log('Initialize form...');
    this.profilForm.patchValue({
      lastName: this.adminUser.lastName,
      firstName: this.adminUser.firstName,
      phoneNumber: this.connectedMembre.phoneNumber,
      roles: this.connectedMembre.roles,
      email: this.adminUser.email,
    })
}

  updateProfil(){
    console.log('update profil)');
    this.updateUser(this.adminUser);
    this.updateMembre(this.connectedMembre);
    if (this.adminUser.id !== undefined) {
      this.adminUserService.update(this.adminUser).subscribe(
        () => {
          this.membreService.update(this.connectedMembre).subscribe(
            () => {
              this.onSaveSuccess()
            },
            (err) => this.onSaveError("Erreur lors de la sauvegarde des infos de membre. ",err)
          );
        },
        (err) => this.onSaveError("Erreur lors de la sauvegarde des infos utilisateur. ",err)
      );
    }
  }

  private updateUser(user: User): void {
    user.firstName = this.profilForm.get(['firstName'])!.value;
    user.lastName = this.profilForm.get(['lastName'])!.value;
    user.email = this.profilForm.get(['email'])!.value;
  }

  private updateMembre(membre: Membre): void {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    membre.phoneNumber = this.profilForm.get(['phoneNumber'])!.value;
    membre.roles = this.profilForm.get(['roles'])!.value;
    const today = dayjs().startOf('day');
    membre.updatedDate = today;
    membre.creationDate = dayjs(membre.creationDate);
  }

  changePassword(): void {
    this.error = '';
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['password'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
        () => (this.onSaveSuccess()),
        (error) => (this.onSaveError("Erreur lors de la sauvegarde du nouveau password. ", error))
      );
    }
  }

  private onSaveSuccess(): void {
    this.success = true;
    this.error = "";
    //this.previousState();
  }

  private onSaveError(message , error): void {
    console.log('error:' ,error);
    this.error = message;
    if(error.error.errorKey === 'emailexists') {
      this.error += "L'email est déjà utilisé.";
    }
    if(error.error.title === 'Incorrect password'){
      this.error += "Le mot de passe actuel est incorrect.";
    }
    this.success = false;
    
  }

  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) { 
    return f1 && f2 && f1.name === f2.name; 
  }

  navigateback(){
    this.router.navigateByUrl('/admin/profil');
    
  }
}
