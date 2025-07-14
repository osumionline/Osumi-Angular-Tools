import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * Componente para mostrar un diálogo de confirmación.
 *
 * Permite mostrar un mensaje de confirmación con un título, contenido y botones de confirmación y cancelar personalizables.
 *
 * @returns Devuelve mediante un observable la notificación de cierre del diálogo indicando si se ha confirmado o cancelado la acción.
 */
@Component({
  selector: 'oat-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgClass,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialogComponent {
  public dialogRef: MatDialogRef<ConfirmDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public warn: WritableSignal<boolean> = signal<boolean>(false);
  public ok: WritableSignal<string> = signal<string>('Continuar');
  public cancel: WritableSignal<string> = signal<string>('Cancelar');
}
