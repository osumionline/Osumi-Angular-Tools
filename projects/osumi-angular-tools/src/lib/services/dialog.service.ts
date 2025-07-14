import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertDialogComponent } from '../components/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog.component';
import { FormDialogComponent } from '../components/dialogs/form-dialog/form-dialog.component';
import { DialogField, DialogOptions } from '../interfaces/dialogs.interface';

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

  /**
   * Método para mostrar un diálogo de alerta.
   * @param options Datos a mostrar en el diálogo, incluyendo título, contenido y texto del botón de confirmación (opcional).
   * @returns Devuelve un observable para notificar el cierre del diálogo.
   */
  public alert(options: DialogOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<AlertDialogComponent> =
      this.dialog.open(AlertDialogComponent);

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
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(
      ConfirmDialogComponent
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
    const dialogRef: MatDialogRef<FormDialogComponent> =
      this.dialog.open(FormDialogComponent);

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
}
