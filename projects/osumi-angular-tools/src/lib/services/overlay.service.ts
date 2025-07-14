import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, Type } from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';
import { Modal } from '../interfaces/modals.interface';
import { CustomOverlayRef } from '../model/custom-overlay-ref.model';

/**
 * Servicio para manejar modales personalizados en la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class OverlayService {
  private overlay: Overlay = inject(Overlay);
  private injector: Injector = inject(Injector);

  /**
   * Método para abrir un componente personalizado en un modal.
   * @param content Componente a mostrar en el overlay.
   * @param data Datos a pasar al componente del overlay.
   * @param panelCssClasses Clases CSS adicionales para el panel del overlay (opcional).
   * @param closeOnBackdropCLick Indica si el overlay se cierra al hacer clic en el fondo (opcional, por defecto true).
   * @returns Devuelve una referencia personalizada del overlay.
   */
  open<R = any>(
    content: Type<any>,
    data: Modal,
    panelCssClasses: string[] = [],
    closeOnBackdropCLick: boolean = true
  ): CustomOverlayRef<R> {
    const _panelCssClasses: string[] = ['modals-panel'].concat(panelCssClasses);
    const config = new OverlayConfig({
      hasBackdrop: true,
      panelClass: _panelCssClasses,
      backdropClass: 'modals-background',
      width: '100%',
      height: '100%',
    });

    const overlayRef = this.overlay.create(config);

    const customOverlayRef = new CustomOverlayRef(
      overlayRef,
      content,
      data,
      closeOnBackdropCLick
    );
    const injector = this.createInjector(customOverlayRef, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));

    return customOverlayRef;
  }

  private createInjector(ref: CustomOverlayRef, inj: Injector): Injector {
    return Injector.create({
      providers: [{ provide: CustomOverlayRef, useValue: ref }],
      parent: inj,
    });
  }
}
