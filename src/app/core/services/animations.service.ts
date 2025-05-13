import {
  AnimationReferenceMetadata,
  AnimationTriggerMetadata,
  animate,
  animateChild,
  animation,
  group,
  keyframes,
  query,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Injectable } from '@angular/core';
import {
  IAnimationOptions,
  ISlideInRightAnimationOptions,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AnimationsService {}

const DEFAULT_DURATION = 1000;

const slideInRight = () =>
  animation([
    animate(
      '{{duration}}ms {{delay}}ms',
      keyframes([
        style({
          visibility: 'visible',
          transform: 'translate3d({{translate}}, 0, 0)',
          easing: 'ease',
          offset: 0,
        }),
        style({ transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
      ])
    ),
  ]);

export function useAnimationIncludingChildren(
  animation: AnimationReferenceMetadata,
  options?: IAnimationOptions
) {
  return [
    ...(options && options.animateChildren === 'before'
      ? [query('@*', animateChild(), { optional: true })]
      : []),
    group([
      useAnimation(animation),
      ...(!options ||
      !options.animateChildren ||
      options.animateChildren === 'together'
        ? [query('@*', animateChild(), { optional: true })]
        : []),
    ]),
    ...(options && options.animateChildren === 'after'
      ? [query('@*', animateChild(), { optional: true })]
      : []),
  ];
}

export function slideInRightAnimation(
  options?: ISlideInRightAnimationOptions
): AnimationTriggerMetadata {
  return trigger((options && options.anchor) || 'slideInRight', [
    transition(
      '0 => 1',
      [
        style({ visibility: 'hidden' }),
        ...useAnimationIncludingChildren(slideInRight(), options),
      ],
      {
        params: {
          delay: (options && options.delay) || 0,
          duration: (options && options.duration) || DEFAULT_DURATION,
          translate: (options && options.translate) || '100%',
        },
      }
    ),
  ]);
}

export function slideInRightOnEnterAnimation(
  options?: ISlideInRightAnimationOptions
): AnimationTriggerMetadata {
  return trigger((options && options.anchor) || 'slideInRightOnEnter', [
    transition(
      ':enter',
      [
        style({ visibility: 'hidden' }),
        ...useAnimationIncludingChildren(slideInRight(), options),
      ],
      {
        params: {
          delay: (options && options.delay) || 0,
          duration: (options && options.duration) || DEFAULT_DURATION,
          translate: (options && options.translate) || '100%',
        },
      }
    ),
  ]);
}

const slideInUp = () =>
  animation([
    animate(
      '{{duration}}ms {{delay}}ms',
      keyframes([
        style({
          visibility: 'visible',
          transform: 'translate3d(0, {{translate}}, 0)',
          easing: 'ease',
          offset: 0,
        }),
        style({ transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
      ])
    ),
  ]);

export interface ISlideInUpAnimationOptions extends IAnimationOptions {
  /**
   * Translate, possible units: px, %, em, rem, vw, vh
   *
   * Default: 100%
   */
  translate?: string;
}
export function slideInUpAnimation(
  options?: ISlideInUpAnimationOptions
): AnimationTriggerMetadata {
  return trigger((options && options.anchor) || 'slideInUp', [
    transition(
      '0 => 1',
      [
        style({ visibility: 'hidden' }),
        ...useAnimationIncludingChildren(slideInUp(), options),
      ],
      {
        params: {
          delay: (options && options.delay) || 0,
          duration: (options && options.duration) || DEFAULT_DURATION,
          translate: (options && options.translate) || '100%',
        },
      }
    ),
  ]);
}

export function slideInUpOnEnterAnimation(
  options?: ISlideInUpAnimationOptions
): AnimationTriggerMetadata {
  return trigger((options && options.anchor) || 'slideInUpOnEnter', [
    transition(
      ':enter',
      [
        style({ visibility: 'hidden' }),
        ...useAnimationIncludingChildren(slideInUp(), options),
      ],
      {
        params: {
          delay: (options && options.delay) || 0,
          duration: (options && options.duration) || DEFAULT_DURATION,
          translate: (options && options.translate) || '100%',
        },
      }
    ),
  ]);
}
