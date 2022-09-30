import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'membres',
    templateUrl    : './membres.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembresComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
