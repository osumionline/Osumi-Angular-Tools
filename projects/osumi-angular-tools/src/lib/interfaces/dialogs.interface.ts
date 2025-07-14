/**
 * Interfaz para definir los campos de un diálogo.
 *
 * Cada campo puede tener un título, tipo, valor, si es requerido y mensaje de error en caso de que no se rellene.
 */
export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
  required?: boolean;
}

/**
 * Interfaz para definir las opciones de un diálogo.
 *
 * Incluye título, contenido, si es una advertencia, campos personalizados y textos para los botones de acción.
 */
export interface DialogOptions {
  title: string;
  content: string;
  warn?: boolean;
  fields?: DialogField[] | undefined;
  ok?: string | undefined;
  cancel?: string | undefined;
}
