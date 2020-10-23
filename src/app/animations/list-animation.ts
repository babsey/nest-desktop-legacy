import { animate, query, stagger, style, transition, trigger } from '@angular/animations';


export const listAnimation =
  trigger('listAnimation', [
    transition('* => *', [
      query(':enter', [
        style({
          opacity: 0,
        }),
        stagger(20, [
          animate('0.5s', style({
            opacity: 1,
          }))
        ])
      ], { optional: true })
    ])
  ]);
