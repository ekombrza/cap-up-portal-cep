const plugin = require('tailwindcss/plugin');

module.exports = plugin(({
    addComponents
}) =>
{
    /*
    * Add base components. These are very important for everything to look
    * correct. We are adding these to the 'components' layer because they must
    * be defined before pretty much everything else.
    */
    addComponents(
        {
            '.mat-icon'       : {
                '--tw-text-opacity': '1',
                color              : 'rgba(var(--ekbz-mat-icon-rgb), var(--tw-text-opacity))'
            },
            '.text-default'   : {
                '--tw-text-opacity': '1 !important',
                color              : 'rgba(var(--ekbz-text-default-rgb), var(--tw-text-opacity)) !important'
            },
            '.text-secondary' : {
                '--tw-text-opacity': '1 !important',
                color              : 'rgba(var(--ekbz-text-secondary-rgb), var(--tw-text-opacity)) !important'
            },
            '.text-hint'      : {
                '--tw-text-opacity': '1 !important',
                color              : 'rgba(var(--ekbz-text-hint-rgb), var(--tw-text-opacity)) !important'
            },
            '.text-disabled'  : {
                '--tw-text-opacity': '1 !important',
                color              : 'rgba(var(--ekbz-text-disabled-rgb), var(--tw-text-opacity)) !important'
            },
            '.divider'        : {
                color: 'var(--ekbz-divider) !important'
            },
            '.bg-card'        : {
                '--tw-bg-opacity': '1 !important',
                backgroundColor  : 'rgba(var(--ekbz-bg-card-rgb), var(--tw-bg-opacity)) !important'
            },
            '.bg-default'     : {
                '--tw-bg-opacity': '1 !important',
                backgroundColor  : 'rgba(var(--ekbz-bg-default-rgb), var(--tw-bg-opacity)) !important'
            },
            '.bg-dialog'      : {
                '--tw-bg-opacity': '1 !important',
                backgroundColor  : 'rgba(var(--ekbz-bg-dialog-rgb), var(--tw-bg-opacity)) !important'
            },
            '.ring-bg-default': {
                '--tw-ring-opacity': '1 !important',
                '--tw-ring-color'  : 'rgba(var(--ekbz-bg-default-rgb), var(--tw-ring-opacity)) !important'
            },
            '.ring-bg-card'   : {
                '--tw-ring-opacity': '1 !important',
                '--tw-ring-color'  : 'rgba(var(--ekbz-bg-card-rgb), var(--tw-ring-opacity)) !important'
            }
        }
    );

    addComponents(
        {
            '.bg-hover': {
                backgroundColor: 'var(--ekbz-bg-hover) !important'
            }
        }
    );
});