/**
 * Interfaz para definir el aspecto de un modal.
 *
 * Incluye color, título, clases CSS opcionales y una opción para ocultar el botón de cierre.
 */
export interface Modal {
  modalColor: 'blue' | 'yellow' | 'red';
  modalTitle: string;
  css?: string;
  contentCss?: string;
  hideCloseBtn?: boolean;
}

/**
 * Interfaz para definir el evento de cierre de un modal.
 *
 * Incluye el tipo de cierre (clic en el fondo o cierre manual) y los datos asociados al cierre.
 */
export interface OverlayCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data: R;
}
