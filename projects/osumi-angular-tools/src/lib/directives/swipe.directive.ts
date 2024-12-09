import {
  Directive,
  ElementRef,
  inject,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { SwipeData } from '../interfaces/swipe.interface';

@Directive({
  selector: '[oatSwipe]',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchend)': 'onTouchEnd($event)',
    '(mousedown)': 'onMouseDown($event)',
    '(mouseup)': 'onMouseUp($event)',
  },
})
export class SwipeDirective {
  private el: ElementRef = inject(ElementRef);
  swipeEnd: OutputEmitterRef<SwipeData> = output<SwipeData>();

  private startX: number = 0;
  private startY: number = 0;

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const endX: number = event.changedTouches[0].clientX;
    const endY: number = event.changedTouches[0].clientY;
    const deltaX: number = endX - this.startX;
    const deltaY: number = endY - this.startY;

    this.swipeEnd.emit({ x: deltaX, y: deltaY });
  }

  onMouseDown(event: MouseEvent): void {
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onMouseUp(event: MouseEvent): void {
    const endX: number = event.clientX;
    const endY: number = event.clientY;
    const deltaX: number = endX - this.startX;
    const deltaY: number = endY - this.startY;

    this.swipeEnd.emit({ x: deltaX, y: deltaY });
  }
}
