import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

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
