import { animate, query, stagger, style, transition, trigger } from '@angular/animations';


export const listAnimation =
  trigger('listAnimation', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(0px)' }),
        stagger(20, [
          animate('0.2s', style({ opacity: 1, transform: 'translateX(0px)'  }))
        ])
      ], { optional: true })
    ])
  ]);
