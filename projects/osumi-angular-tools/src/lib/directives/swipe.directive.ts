import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
  OutputEmitterRef,
  Renderer2,
} from '@angular/core';
import { SwipeData } from '../interfaces/swipe.interface';

@Directive({
  selector: '[oatSwipe]',
  standalone: true,
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchend)': 'onTouchEnd($event)',
    '(mousedown)': 'onMouseDown($event)',
    '(mouseup)': 'onMouseUp($event)',
  },
})
export class SwipeDirective implements OnDestroy {
  private el: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);
  swipeEnd: OutputEmitterRef<SwipeData> = output<SwipeData>();

  private startX: number = 0;
  private startY: number = 0;

  private touchStartListener: () => void;
  private touchEndListener: () => void;
  private mouseDownListener: () => void;
  private mouseUpListener: () => void;

  constructor() {
    this.touchStartListener = this.renderer.listen(
      this.el.nativeElement,
      'touchstart',
      (event: TouchEvent): void => this.onTouchStart(event)
    );
    this.touchEndListener = this.renderer.listen(
      this.el.nativeElement,
      'touchend',
      (event: TouchEvent): void => this.onTouchEnd(event)
    );
    this.mouseDownListener = this.renderer.listen(
      this.el.nativeElement,
      'mousedown',
      (event: MouseEvent): void => this.onMouseDown(event)
    );
    this.mouseUpListener = this.renderer.listen(
      this.el.nativeElement,
      'mouseup',
      (event: MouseEvent): void => this.onMouseUp(event)
    );
  }

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

  ngOnDestroy(): void {
    this.touchStartListener();
    this.touchEndListener();
    this.mouseDownListener();
    this.mouseUpListener();
  }
}
