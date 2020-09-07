import { trigger, state, style, animate, transition } from '@angular/animations';

export const hideAnimation =
  trigger('hideAnimation', [
    state('opened', style({ transform: 'translateX(100%)' })),
    state('closed', style({ transform: 'translateX(0%)' })),
    transition('* => *', [
      animate(500)
    ])
  ]);
