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
