export interface Modal {
  modalColor: 'blue' | 'yellow' | 'red';
  modalTitle: string;
  css?: string;
  hideCloseBtn?: boolean;
}

export interface OverlayCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data: R;
}
