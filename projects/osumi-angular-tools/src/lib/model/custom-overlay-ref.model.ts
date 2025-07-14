import { OverlayRef } from '@angular/cdk/overlay';
import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlayCloseEvent } from '../interfaces/modals.interface';

/**
 * Clase que representa una referencia a un overlay personalizado.
 *
 * Permite cerrar el overlay y notificar a los suscriptores sobre el evento de cierre.
 *
 * @template R Tipo de dato de respuesta.
 * @template T Tipo de dato pasado al modal.
 */
export class CustomOverlayRef<R = any, T = any> {
  afterClosed$ = new Subject<OverlayCloseEvent<R | null>>();

  constructor(
    public overlay: OverlayRef,
    public content: Type<any>,
    public data: T,
    public closeOnBackdropCLick: boolean = true
  ) {
    if (closeOnBackdropCLick) {
      overlay.backdropClick().subscribe({
        next: () => {
          this._close('backdropClick', null);
        },
      });
    }
  }

  close(data?: any): void {
    this._close('close', data!);
  }

  private _close(type: 'backdropClick' | 'close', data: R | null): void {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });

    this.afterClosed$.complete();
  }
}
