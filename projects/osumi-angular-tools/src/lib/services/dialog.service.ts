import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertDialogComponent } from '../components/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog.component';
import { FormDialogComponent } from '../components/dialogs/form-dialog/form-dialog.component';
import { DialogField, DialogOptions } from '../interfaces/dialogs.interface';

type DialogResult = boolean | DialogField[] | undefined;
const DEFAULT_DIALOG_ANIMATION_DURATION: number = 220;

/**
 * Servicio para manejar diálogos en la aplicación.
 *
 * Permite abrir diálogos de alerta, confirmación y formularios personalizados.
 *
 * Cada método devuelve un observable que emite el resultado del diálogo al cerrarse.
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialog: MatDialog = inject(MatDialog);
  private document: Document = inject(DOCUMENT);
  private platformId: object = inject(PLATFORM_ID);

  private static dialogId: number = 0;

  /**
   * Método para mostrar un diálogo de alerta.
   * @param options Datos a mostrar en el diálogo, incluyendo título, contenido y texto del botón de confirmación (opcional).
   * @returns Devuelve un observable para notificar el cierre del diálogo.
   */
  public alert(options: DialogOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<AlertDialogComponent> = this.openDialog(
      AlertDialogComponent,
      options,
    );

    dialogRef.componentInstance.title.set(options.title);
    dialogRef.componentInstance.content.set(options.content);
    if (options.ok !== undefined) {
      dialogRef.componentInstance.ok.set(options.ok);
    }

    return dialogRef.afterClosed();
  }

  /**
   * Método para mostrar un diálogo de confirmación.
   * @param options Datos a mostrar en el diálogo, incluyendo título, contenido, si es una advertencia (opcional) y textos para los botones de acción (opcionales).
   * @returns Devuelve un observable para notificar el cierre del diálogo con el valor true para diálogo aceptado y false para diálogo cancelado.
   */
  public confirm(options: DialogOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.openDialog(
      ConfirmDialogComponent,
      options,
    );

    dialogRef.componentInstance.title.set(options.title);
    dialogRef.componentInstance.content.set(options.content);
    if (options.warn !== undefined) {
      dialogRef.componentInstance.warn.set(options.warn);
    }
    if (options.ok !== undefined) {
      dialogRef.componentInstance.ok.set(options.ok);
    }
    if (options.cancel !== undefined) {
      dialogRef.componentInstance.cancel.set(options.cancel);
    }

    return dialogRef.afterClosed();
  }

  /**
   * Método para mostrar un diálogo con un formulario personalizado.
   * @param options Datos a mostrar en el diálogo, incluyendo título, campos a rellenar y textos para los botones de acción (opcionales).
   * @returns Devuelve un observable para notificar el cierre del diálogo con los valores introducidos en el formulario.
   */
  public form(options: DialogOptions): Observable<DialogField[]> {
    const dialogRef: MatDialogRef<FormDialogComponent> = this.openDialog(
      FormDialogComponent,
      options,
    );

    dialogRef.componentInstance.title.set(options.title);
    dialogRef.componentInstance.content.set(options.content);
    if (options.ok !== undefined) {
      dialogRef.componentInstance.ok.set(options.ok);
    }
    if (options.cancel !== undefined) {
      dialogRef.componentInstance.cancel.set(options.cancel);
    }
    if (options.fields !== undefined) {
      dialogRef.componentInstance.fields.set(options.fields);
    }

    return dialogRef.afterClosed();
  }

  private openDialog<TComponent>(
    component: Type<TComponent>,
    options: DialogOptions,
  ): MatDialogRef<TComponent> {
    const panelClass: string | undefined =
      options.from !== undefined ? this.getPanelClass() : undefined;
    const dialogConfig: MatDialogConfig = {};

    if (panelClass !== undefined) {
      dialogConfig.panelClass = panelClass;
      dialogConfig.disableClose = true;
      dialogConfig.enterAnimationDuration = '0ms';
      dialogConfig.exitAnimationDuration = '0ms';
    }

    const dialogRef: MatDialogRef<TComponent> = this.dialog.open(component, dialogConfig);

    const animationDuration: number = this.getAnimationDuration(options);

    this.configureDialogClose(dialogRef, panelClass, options.from, animationDuration);

    if (panelClass !== undefined && options.from !== undefined) {
      this.prepareDialogOpen(panelClass);
      this.animateDialogOpen(panelClass, options.from, animationDuration);
    }

    return dialogRef;
  }

  private configureDialogClose<TComponent>(
    dialogRef: MatDialogRef<TComponent>,
    panelClass: string | undefined,
    from: HTMLElement | undefined,
    animationDuration: number,
  ): void {
    let closing: boolean = false;
    const closeDialog = (result?: DialogResult): void => {
      if (closing) {
        return;
      }

      closing = true;
      void this.closeDialog(dialogRef, panelClass, from, animationDuration, result);
    };

    (
      dialogRef.componentInstance as TComponent & {
        closeDialog?: (result?: DialogResult) => void;
      }
    ).closeDialog = closeDialog;

    if (panelClass === undefined || from === undefined) {
      return;
    }

    dialogRef.backdropClick().subscribe({
      next: (): void => {
        closeDialog();
      },
    });

    dialogRef.keydownEvents().subscribe({
      next: (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          closeDialog();
        }
      },
    });
  }

  private getPanelClass(): string {
    DialogService.dialogId++;
    return `oat-dialog-from-${DialogService.dialogId}`;
  }

  private animateDialogOpen(
    panelClass: string,
    from: HTMLElement,
    animationDuration: number,
  ): void {
    this.runAfterRender((): void => {
      const panel: HTMLElement | null = this.getPanel(panelClass);
      const animationStart: Keyframe | null = this.getOriginKeyframe(panel, from);

      if (panel === null || animationStart === null) {
        if (panel !== null) {
          panel.style.opacity = '';
        }
        return;
      }

      const animation: Animation = panel.animate(
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
          duration: animationDuration,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
        },
      );

      animation.onfinish = (): void => {
        panel.style.opacity = '';
      };
      animation.oncancel = (): void => {
        panel.style.opacity = '';
      };
    });
  }

  private prepareDialogOpen(panelClass: string): void {
    if (!this.canAnimate()) {
      return;
    }

    const panel: HTMLElement | null = this.getPanel(panelClass);

    if (panel !== null) {
      panel.style.opacity = '0';
    }
  }

  private async closeDialog<TComponent>(
    dialogRef: MatDialogRef<TComponent>,
    panelClass: string | undefined,
    from: HTMLElement | undefined,
    animationDuration: number,
    result?: DialogResult,
  ): Promise<void> {
    if (panelClass === undefined || from === undefined) {
      dialogRef.close(result);
      return;
    }

    const panel: HTMLElement | null = this.getPanel(panelClass);
    const animationEnd: Keyframe | null = this.getOriginKeyframe(panel, from);

    if (panel === null || animationEnd === null) {
      dialogRef.close(result);
      return;
    }

    await this.animatePanelClose(
      panel,
      animationEnd,
      this.getCloseAnimationDuration(animationDuration),
    );
    dialogRef.close(result);
  }

  private animatePanelClose(
    panel: HTMLElement,
    animationEnd: Keyframe,
    animationDuration: number,
  ): Promise<void> {
    panel.style.pointerEvents = 'none';

    const animation: Animation = panel.animate(
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
        duration: animationDuration,
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

  private getOriginKeyframe(panel: HTMLElement | null, from: HTMLElement): Keyframe | null {
    if (
      panel === null ||
      !this.canAnimate() ||
      !from.isConnected ||
      typeof panel.animate !== 'function'
    ) {
      return null;
    }

    const fromRect: DOMRect = from.getBoundingClientRect();
    const panelRect: DOMRect = panel.getBoundingClientRect();

    if (
      fromRect.width === 0 ||
      fromRect.height === 0 ||
      panelRect.width === 0 ||
      panelRect.height === 0
    ) {
      return null;
    }

    const fromCenterX: number = fromRect.left + fromRect.width / 2;
    const fromCenterY: number = fromRect.top + fromRect.height / 2;
    const panelCenterX: number = panelRect.left + panelRect.width / 2;
    const panelCenterY: number = panelRect.top + panelRect.height / 2;
    const translateX: number = fromCenterX - panelCenterX;
    const translateY: number = fromCenterY - panelCenterY;
    const scale: number = this.clamp(
      Math.min(fromRect.width / panelRect.width, fromRect.height / panelRect.height),
      0.12,
      0.45,
    );

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: 'center center',
    };
  }

  private getPanel(panelClass: string): HTMLElement | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.document.querySelector<HTMLElement>(`.${panelClass}`);
  }

  private canAnimate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const defaultView: Window | null = this.document.defaultView;

    return (
      defaultView !== null && !defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private runAfterRender(callback: () => void): void {
    const defaultView: Window | null = this.document.defaultView;

    if (!isPlatformBrowser(this.platformId) || defaultView === null) {
      callback();
      return;
    }

    defaultView.requestAnimationFrame((): void => {
      defaultView.requestAnimationFrame(callback);
    });
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getAnimationDuration(options: DialogOptions): number {
    return this.clamp(
      options.animationDuration ?? DEFAULT_DIALOG_ANIMATION_DURATION,
      0,
      5000,
    );
  }

  private getCloseAnimationDuration(animationDuration: number): number {
    return Math.round(animationDuration * 0.82);
  }
}
