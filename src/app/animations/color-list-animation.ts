import { animate, query, stagger, style, transition, trigger } from '@angular/animations';


export const colorListAnimation =
  trigger('colorListAnimation', [
    transition('* => *', [
      query(':enter', [
        style({
          backgroundColor: '#FBB117',
          opacity: 0,
        }),
        stagger(20, [
          animate('0.5s', style({
            opacity: 1,
            backgroundColor: 'white',
          }))
        ])
      ], { optional: true })
    ])
  ]);
