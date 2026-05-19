import { OverlayRef } from '@angular/cdk/overlay';
import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlayCloseEvent } from '../interfaces/modals.interface';

type OverlayCloseAnimation = () => Promise<void>;

/**
 * Clase que representa una referencia a un overlay personalizado.
 *
 * Permite cerrar el overlay y notificar a los suscriptores sobre el evento de cierre.
 *
 * @template R Tipo de dato de respuesta.
 * @template T Tipo de dato pasado al modal.
 */
export class CustomOverlayRef<R = unknown, T = unknown> {
  afterClosed$ = new Subject<OverlayCloseEvent<R | null>>();
  private closeAnimation: OverlayCloseAnimation | undefined;
  private closing: boolean = false;

  constructor(
    public overlay: OverlayRef,
    public content: Type<unknown>,
    public data: T,
    public closeOnBackdropCLick: boolean = true,
    public from?: HTMLElement,
    public animationDuration?: number
  ) {
    if (closeOnBackdropCLick) {
      overlay.backdropClick().subscribe({
        next: () => {
          void this._close('backdropClick', null);
        },
      });
    }
  }

  close(data?: R): void {
    void this._close('close', data ?? null);
  }

  registerCloseAnimation(closeAnimation: OverlayCloseAnimation): void {
    this.closeAnimation = closeAnimation;
  }

  private async _close(
    type: 'backdropClick' | 'close',
    data: R | null
  ): Promise<void> {
    if (this.closing) {
      return;
    }

    this.closing = true;

    if (this.closeAnimation !== undefined) {
      await this.closeAnimation();
    }

    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });

    this.afterClosed$.complete();
  }
}
