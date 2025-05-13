import { animate, animation, AnimationReferenceMetadata, keyframes, style } from '@angular/animations';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

}

/**
 * Fades in an element in an upwards direction, traveling a percentage of its height.
 * Default parameters: distance '25%', duration '1s', delay '300ms'.
 */
export const fadeInUpAnimation: AnimationReferenceMetadata = animation([
  style({
    visibility: 'hidden'
  }),
  animate('{{ duration }} {{ delay }}', keyframes([
    style({
      visibility: 'visible',
      opacity: 0,
      transform: 'translate3d(0, {{ distance }}, 0)',
      easing: 'ease',
      offset: 0
    }),
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      easing: 'ease',
      offset: 1
    })
  ]))
], {
  params: {
    duration: '1s',
    delay: '300ms',
    distance: '25%'
  }
});