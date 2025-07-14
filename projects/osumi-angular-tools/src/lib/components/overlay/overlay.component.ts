import { NgComponentOutlet } from '@angular/common';
import { Component, inject, OnInit, Renderer2, Type } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Modal } from '../../interfaces/modals.interface';
import { CustomOverlayRef } from '../../model/custom-overlay-ref.model';

/**
 * Componente para mostrar un componente personalizado en una ventana modal.
 *
 * @returns Devuelve mediante un observable la notificación de cierre del modal.
 */
@Component({
  selector: 'oat-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  imports: [MatIcon, MatIconButton, NgComponentOutlet],
})
export class OverlayComponent implements OnInit {
  private customOverlayRef: CustomOverlayRef<any, Modal> =
    inject(CustomOverlayRef);
  private renderer: Renderer2 = inject(Renderer2);

  content: Type<any> = this.customOverlayRef.content;
  inputData: Modal = { modalTitle: '', modalColor: 'blue' };

  ngOnInit(): void {
    this.listenToEscKey();
    this.inputData = this.customOverlayRef.data;
  }

  private listenToEscKey(): void {
    this.renderer.listen('window', 'keyup', (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    this.customOverlayRef.close(null);
  }
}
