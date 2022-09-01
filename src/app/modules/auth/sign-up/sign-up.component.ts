import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { animations } from 'src/@ekbz/animations';
import { AlertType } from 'src/@ekbz/components/alert';
import { AuthService } from 'src/app/models-services/auth/auth.service';
import { Church } from 'src/app/models-services/church/church.model';
import { ChurchService } from 'src/app/models-services/church/church.service';
import { DenominationService } from 'src/app/models-services/denomination/denomination.service';
import { RegisterService } from 'src/app/models-services/register/register.service';
import { IRole } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';
const AUTRE_EGLISE_LABEL = "Autre église";
const USER_ALREADY_USED_TYPE = 'error.userexists';


@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : animations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: AlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    horizontalStepperForm: UntypedFormGroup;
    showAlert: boolean = false;
    listRoles: IRole[];
    listChurches: any[];
    listDenominations: any[];

    /**
     * Constructor
     */
    constructor(
        private _registerService: RegisterService,
        private _roleService: RoleService,
        private _churchService: ChurchService,
        private _denominatiionService : DenominationService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._roleService.query({
            'applicationId.equals':'1', 'typeRole.equals':'PUBLIC'
            }).subscribe(data => {
            this.listRoles = data.body;
            console.log(this.listRoles);
        });

        this._churchService.query().subscribe(
            (res: HttpResponse<Church[]>) => {
              let churches = [{churchName:AUTRE_EGLISE_LABEL}]
              this.listChurches = res.body ?? [];
              this.listChurches = churches.concat(this.listChurches );
              console.log(this.listChurches);
            },
            () => {   
        });

        this._denominatiionService.query().subscribe(data => {
            this.listDenominations = data.body;
            console.log(this.listDenominations);
      
          });

        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
                confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
                lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                roles: ['', [Validators.required]],
            }),
            step2: this._formBuilder.group({
                church: ['', [Validators.required]],
            }),
            step3: this._formBuilder.group({
                churchName:['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9- ]*$')]],
                pastorName:['', [Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9- ]*$')]],
                phoneNumber:['', [Validators.minLength(1), Validators.maxLength(13), Validators.pattern('^[ _.@a-zA-Z0-9- ]*$')]],
                churchEmail:['', [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.email]],
                webSite: ['', [Validators.minLength(1), Validators.maxLength(40), Validators.pattern('^[ :/_.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                denomination:['', [Validators.required]],
                adress1:['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                adress2:['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                city:['', [Validators.required, Validators.minLength(1), Validators.maxLength(60), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                region:['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern('^[ _.@a-zA-Z\u00C0-\u017F0-9-]*$')]],
                postalCode:['', [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[_.@a-zA-Z0-9-]*$')]]
            })
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        console.log('signup call');
        console.log('this.horizontalStepperForm.get(step1).invalid : ', this.horizontalStepperForm.get('step1').invalid)
        console.log('this.horizontalStepperForm.get(step2).invalid : ', this.horizontalStepperForm.get('step2').invalid)
        console.log('this.horizontalStepperForm.get(step3).invalid : ', this.horizontalStepperForm.get('step3').invalid)
        // Do nothing if the form is invalid
        if ( this.horizontalStepperForm.get('step2').get('church').value.churchName !== 'Autre église'
            && (this.horizontalStepperForm.get('step1').invalid || this.horizontalStepperForm.get('step2').invalid))
        {
                console.log('signup call invalid Autre eglise');
                return;
        } else if(this.horizontalStepperForm.get('step2').get('church').value.churchName === 'Autre église' && this.horizontalStepperForm.invalid){
            console.log('signup call invalid');
                return;
        }

        // Disable the form
        this.horizontalStepperForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Controle password
        console.log('password : ', this.horizontalStepperForm.get('step1').get(['password']).value );
        console.log('confirmPassword : ', this.horizontalStepperForm.get('step1').get(['confirmPassword']).value );
        if (this.horizontalStepperForm.get('step1').get(['password']).value !== this.horizontalStepperForm.get('step1').get(['confirmPassword']).value) {
            this.horizontalStepperForm.enable();
            this.alert = {
                type   : 'error',
                message: 'Les mots de passe ne coincident pas.'
            };
            this.showAlert = true;
             // Re-enable the form

        } else {
            // Sign up
            let account = this.prepareData();
            //this._router.navigateByUrl('/confirmation-required');
            this._registerService.signUp(account)
                .subscribe(
                    (response) => {

                        // Navigate to the confirmation required page
                        this._router.navigateByUrl('/confirmation-required');
                    },
                    (response) => {

                        // Re-enable the form
                        this.horizontalStepperForm.enable();

                        // Reset the form
                        //this.signUpNgForm.resetForm();

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
                );
        }
    }

    prepareData(){
        let adminUserDTO = {};
        const lastName = this.horizontalStepperForm.get('step1').get(['lastName']).value;
        const firstName = this.horizontalStepperForm.get('step1').get(['firstName']).value;
        const email = this.horizontalStepperForm.get('step1').get(['email']).value;
        const login = email;
        const password = this.horizontalStepperForm.get('step1').get(['password']).value;
        adminUserDTO = { ...adminUserDTO, lastName, firstName, login, email, password };
        adminUserDTO = { ...adminUserDTO, langKey: 'fr' };
        
        let membreDTO = {};
        const inAppNotification:boolean = true;
        const emailNotification:boolean = true;
        const phoneNumber:string = "";
        const jobStatus:string = "INACTIVE";
        const roles = this.horizontalStepperForm.get('step1').get(['roles']).value;
        
        let church:any = {};
        console.log('this.horizontalStepperForm.get(step2).get(church).value.churchName : ', this.horizontalStepperForm.get('step2').get('church').value.churchName);
        if(this.horizontalStepperForm.get('step2').get('church').value.churchName !== 'Autre église'){
            church = this.horizontalStepperForm.get('step2').get(['church']).value;
        } else {
            const churchName = this.horizontalStepperForm.get('step3').get(['churchName']).value;
            const pastorName = this.horizontalStepperForm.get('step3').get(['pastorName']).value;
            const phoneNumber = this.horizontalStepperForm.get('step3').get(['phoneNumber']).value;
            const email = this.horizontalStepperForm.get('step3').get(['churchEmail']).value;
            const website = this.horizontalStepperForm.get('step3').get(['webSite']).value;
            const denomination = this.horizontalStepperForm.get('step3').get(['denomination']).value;
            const adress1 = this.horizontalStepperForm.get('step3').get(['adress1']).value;
            const adress2 = this.horizontalStepperForm.get('step3').get(['adress2']).value;
            const city = this.horizontalStepperForm.get('step3').get(['city']).value;
            const region = this.horizontalStepperForm.get('step3').get(['region']).value;
            const postalCode = this.horizontalStepperForm.get('step3').get(['postalCode']).value;
            const country = {"id":"1", "name":"France"}
            
            let adress = {};
            adress = {...adress, adress1, adress2, city, region, postalCode, country};

            church = { ...church, churchName, pastorName, phoneNumber, email, website, denomination, adress };
        }
        membreDTO = { ...membreDTO, phoneNumber, inAppNotification, emailNotification, jobStatus, church, roles };
        
        let account = {};
        account = { ...account, adminUserDTO, membreDTO, password};
        
       return account;    
    }
}
