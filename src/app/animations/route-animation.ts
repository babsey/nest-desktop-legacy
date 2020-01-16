import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';


export const routeNavAnimation =
  trigger('routeNavAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'fixed', height: '100%', width: '259px' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(0px)', opacity: 0, }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(0%)', opacity: 1, }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0px)', opacity: 1, }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(0%)', opacity: 0,}))
        ], { optional: true }),
      ])
    ]),
  ]);

export const routeAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'fixed', height: '100%', width: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateY(0px)', opacity: 0 }),
          animate('0.5s ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateY(0px)', opacity: 1 }),
          animate('0.2s ease-in-out', style({ transform: 'translateY(0px)', opacity: 0 }))
        ], { optional: true }),
      ])
    ]),
  ]);
