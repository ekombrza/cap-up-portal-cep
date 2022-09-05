import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { animations } from 'src/@ekbz/animations';
import { AuthService } from 'src/app/models-services/auth/auth.service';
import { UserService } from 'src/app/models-services/user/user.service';
import { AlertType } from 'src/@ekbz/components/alert';
import { ActivateService } from 'src/app/models-services/auth/activate.service';
import { mergeMap } from 'rxjs';

@Component({
    selector     : 'auth-activate',
    templateUrl  : './activate.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : animations
})
export class AuthActivateComponent implements OnInit
{
    error = false;
    success = false;

    /**
     * Constructor
     */
    constructor(
        private activateService: ActivateService,
        private route: ActivatedRoute
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
        this.route.queryParams.pipe(mergeMap(params => this.activateService.get(params.key))).subscribe(
            () => (this.success = true),
            () => (this.error = true)
          );
    }
}
