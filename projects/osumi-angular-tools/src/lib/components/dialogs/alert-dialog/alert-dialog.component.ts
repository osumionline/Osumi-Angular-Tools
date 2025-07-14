import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * Componente para mostrar un diálogo de alerta.
 *
 * Permite mostrar un mensaje de alerta con un título, contenido y un botón de confirmación personalizables.
 *
 * @returns Devuelve mediante un observable la notificación de cierre del diálogo.
 */
@Component({
  selector: 'oat-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export class AlertDialogComponent {
  public dialogRef: MatDialogRef<AlertDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public ok: WritableSignal<string> = signal<string>('Continuar');
}
