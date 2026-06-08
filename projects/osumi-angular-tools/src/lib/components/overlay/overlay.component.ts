import { NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  Signal,
  Type,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Modal } from '../../interfaces/modals.interface';
import { CustomOverlayRef } from '../../model/custom-overlay-ref.model';

const DEFAULT_OVERLAY_ANIMATION_DURATION: number = 220;

/**
 * Componente para mostrar un componente personalizado en una ventana modal.
 *
 * @returns Devuelve mediante un observable la notificación de cierre del modal.
 */
@Component({
  selector: 'oat-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  imports: [MatIcon, MatIconButton, NgComponentOutlet],
})
export class OverlayComponent implements OnInit, AfterViewInit {
  private customOverlayRef: CustomOverlayRef<unknown, Modal> = inject(CustomOverlayRef);
  private renderer: Renderer2 = inject(Renderer2);
  private modal: Signal<ElementRef<HTMLElement>> = viewChild.required('modal');

  content: Type<unknown> = this.customOverlayRef.content;
  inputData: Modal = { modalTitle: '', modalColor: 'blue' };

  ngOnInit(): void {
    this.listenToEscKey();
    this.inputData = this.customOverlayRef.data;
  }

  ngAfterViewInit(): void {
    this.customOverlayRef.registerCloseAnimation((): Promise<void> => {
      return this.animateClose();
    });

    this.animateOpen();
  }

  private listenToEscKey(): void {
    this.renderer.listen('window', 'keyup', (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    this.customOverlayRef.close(null);
  }

  private animateOpen(): void {
    const modal: HTMLElement = this.modal().nativeElement;
    const animationStart: Keyframe | null = this.getOriginKeyframe(modal);

    if (animationStart === null) {
      return;
    }

    modal.animate(
      [
        {
          ...animationStart,
          opacity: 0,
        },
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
        },
      ],
      {
        duration: this.getAnimationDuration(),
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    );
  }

  private animateClose(): Promise<void> {
    const modal: HTMLElement = this.modal().nativeElement;
    const animationEnd: Keyframe | null = this.getOriginKeyframe(modal);

    if (animationEnd === null) {
      return Promise.resolve();
    }

    modal.style.pointerEvents = 'none';

    const animation: Animation = modal.animate(
      [
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
        },
        {
          ...animationEnd,
          opacity: 0,
        },
      ],
      {
        duration: this.getCloseAnimationDuration(),
        easing: 'cubic-bezier(0.4, 0, 1, 1)',
        fill: 'forwards',
      },
    );

    return new Promise((resolve: () => void): void => {
      animation.onfinish = (): void => {
        resolve();
      };
      animation.oncancel = (): void => {
        resolve();
      };
    });
  }

  private getOriginKeyframe(modal: HTMLElement): Keyframe | null {
    const from: HTMLElement | undefined = this.customOverlayRef.from;

    if (
      from === undefined ||
      !from.isConnected ||
      this.prefersReducedMotion() ||
      typeof modal.animate !== 'function'
    ) {
      return null;
    }

    const fromRect: DOMRect = from.getBoundingClientRect();
    const modalRect: DOMRect = modal.getBoundingClientRect();

    if (
      fromRect.width === 0 ||
      fromRect.height === 0 ||
      modalRect.width === 0 ||
      modalRect.height === 0
    ) {
      return null;
    }

    const fromCenterX: number = fromRect.left + fromRect.width / 2;
    const fromCenterY: number = fromRect.top + fromRect.height / 2;
    const modalCenterX: number = modalRect.left + modalRect.width / 2;
    const modalCenterY: number = modalRect.top + modalRect.height / 2;
    const translateX: number = fromCenterX - modalCenterX;
    const translateY: number = fromCenterY - modalCenterY;
    const scale: number = this.clamp(
      Math.min(fromRect.width / modalRect.width, fromRect.height / modalRect.height),
      0.12,
      0.45,
    );

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: 'center center',
    };
  }

  private getAnimationDuration(): number {
    return this.clamp(
      this.customOverlayRef.animationDuration ?? DEFAULT_OVERLAY_ANIMATION_DURATION,
      0,
      5000,
    );
  }

  private getCloseAnimationDuration(): number {
    return Math.round(this.getAnimationDuration() * 0.82);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
