import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationConfig } from '../confirmation.types';

@Component({
    selector     : 'fuse-confirmation-dialog',
    templateUrl  : './dialog.component.html',
    styleUrls: ['./dialog.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent
{
    /**
     * Constructor
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationConfig)
    {
    }

}
