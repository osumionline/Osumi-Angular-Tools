import {
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SwipeEvent } from '../interfaces/swipe.interface';
import { createSwipeSubscription } from '../swipe-core/swipe-core';

@Directive({
  selector: '[oatSwipe]',
})
export class SwipeDirective implements OnInit, OnDestroy {
  private elementRef: ElementRef = inject(ElementRef);
  private zone: NgZone = inject(NgZone);
  private swipeSubscription: Subscription | undefined;

  swipeMove: OutputEmitterRef<SwipeEvent> = output<SwipeEvent>();
  swipeEnd: OutputEmitterRef<SwipeEvent> = output<SwipeEvent>();

  ngOnInit(): void {
    this.zone.runOutsideAngular((): void => {
      this.swipeSubscription = createSwipeSubscription({
        domElement: this.elementRef.nativeElement,
        onSwipeMove: (swipeMoveEvent: SwipeEvent): void =>
          this.swipeMove.emit(swipeMoveEvent),
        onSwipeEnd: (swipeEndEvent: SwipeEvent): void =>
          this.swipeEnd.emit(swipeEndEvent),
      });
    });
  }

  ngOnDestroy(): void {
    this.swipeSubscription?.unsubscribe?.();
  }
}
