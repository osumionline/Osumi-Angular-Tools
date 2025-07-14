import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DialogField } from '../../../interfaces/dialogs.interface';

/**
 * Componente para mostrar un diálogo con un formulario.
 *
 * Permite mostrar un mensaje de confirmación con un título, contenido y y un formulario personalizable.
 *
 * @returns Devuelve mediante un observable la notificación de cierre del diálogo con los datos del formulario.
 */
@Component({
  selector: 'oat-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatButton,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FormDialogComponent {
  public dialogRef: MatDialogRef<FormDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public fields: WritableSignal<DialogField[]> = signal<DialogField[]>([]);
  public ok: WritableSignal<string> = signal<string>('Continuar');
  public cancel: WritableSignal<string> = signal<string>('Cancelar');

  /**
   * Método para validar el formulario.
   * Comprueba si todos los campos requeridos tienen un valor no vacío.
   * @returns Devuelve true si el formulario es válido, false en caso contrario.
   */
  isFormValid(): boolean {
    return this.fields().every((field: DialogField): boolean => {
      return (
        !field.required || Boolean(field.value && field.value.trim() !== '')
      );
    });
  }
}
