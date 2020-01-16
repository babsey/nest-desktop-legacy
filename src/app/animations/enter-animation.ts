import { trigger, style, animate, transition } from '@angular/animations';


export const enterAnimation =
  trigger('enterAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('0.5s', style({ opacity: 1 }))
    ])
  ]);
