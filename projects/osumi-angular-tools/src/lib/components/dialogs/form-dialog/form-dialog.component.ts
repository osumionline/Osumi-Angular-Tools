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

@Component({
  standalone: true,
  selector: 'oat-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrl: '../../../../../styles/dialogs.scss',
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
}
