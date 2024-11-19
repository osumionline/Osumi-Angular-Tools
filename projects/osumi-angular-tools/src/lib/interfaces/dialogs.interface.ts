export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  warn?: boolean;
  fields?: DialogField[] | undefined;
  ok?: string | undefined;
  cancel?: string | undefined;
}
