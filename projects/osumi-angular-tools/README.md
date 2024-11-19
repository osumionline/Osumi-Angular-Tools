# Osumi Angular Tools

Librería de componentes y servicios reutilizables. En esta librería se incluyen las siguientes funcionalidades:

- `dialog`: Servicio para crear ventanas de diálogo (`alert`, `confirm` y `form`).
- `overlay`: Servicio para crear ventanas modales en las que cargar componentes personalizados.

NOTA: Para poder usar estos servicios es necesario usar `Angular 18.2+`, `Angular Material 18.2+`, `Angular CDK 18.2+` y `rxjs 7.8+`

**dialog**

Permite mostrar diálogos con mensajes personalizados:

**alert**

Muestra un diálogo con un título (`title`) y un texto (`content`) personalizado. También permite personalizar el texto del botón "Continuar" (`ok`).

```typescript
dialog: DialogService = inject(DialogService);

this.dialog.alert({
  title: "Datos guardados",
  content: 'Los datos del cliente "' + this.selectedClient.nombreApellidos + '" han sido correctamente guardados.',
  ok: "Continuar",
});
```

**confirm**

Muestra un diálogo con un título (`title`) y texto (`content`) personalizables. Permite personalizar el texto de los botones "Continuar" (`ok`) y "Cancelar" (`cancel`).

```typescript
dialog: DialogService = inject(DialogService);

this.dialog
  .confirm({
    title: "Confirmar",
    content: '¿Estás seguro de querer borrar el cliente "' + this.selectedClient.nombreApellidos + '"?',
    ok: "Continuar",
    cancel: "Cancelar",
  })
  .subscribe((result) => {
    if (result === true) {
      this.confirmDeleteCliente();
    }
  });
```

**form**

Permite mostrar un diálogo con una serie de campos (`fields`), un pequeño formulario. Como en los casos anteriores se puede personalizar el título (`title`), el texto (`content`) y los botones "Continuar" (`ok`) y "Cancelar" (`cancel`).

```typescript
dialog: DialogService = inject(DialogService);

this.dialog
  .form({
    title: "Introducir email",
    content: "Introduce el email del cliente",
    ok: "Continuar",
    cancel: "Cancelar",
    fields: [{ title: "Email", type: "email", value: null }],
  })
  .subscribe((result: DialogOptions): void => {
    if (result !== undefined) {
      this.sendTicket(this.historicoVentasSelected.id, result[0].value);
    }
  });
```

**overlay**

Permite mostrar ventanas modales con componentes personalizados. Estos componentes luego pueden pasar datos de vuelta. Se incluye la interfaz `Modal` que se puede extender con campos personalizados para pasar información al modal que se muestra.

```typescript
// Componente que abre un modal
export interface BuscadorModal extends Modal {
  key: string;
}

os: OverlayService = inject(OverlayService);

const modalBuscadorData: BuscadorModal = {
  modalTitle: "Buscador",
  modalColor: "blue",
  css: "modal-wide",
  key: ev.key,
};
const dialog = this.os.open(BuscadorModalComponent, modalBuscadorData); // BuscadorModalComponent sería el componente a mostrar en el modal
dialog.afterClosed$.subscribe((data): void => {
  if (data.data !== null) {
    console.log(data.data); // Resultado obtenido del modal
  } else {
    console.log("El modal se ha cerrado sin devolver datos.");
  }
});

// Componente BuscadorModalComponent abierto en el modal
export default class BuscadorModalComponent implements OnInit {
  private customOverlayRef: CustomOverlayRef<null, { key: string }> = inject(CustomOverlayRef); // Referencia de la que obtener los datos pasados al modal y para pasarle datos de vuelta

  ngOnInit(): void {
    this.searchName = this.customOverlayRef.data.key; // Propiedad pasada al modal
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.customOverlayRef.close(row.localizador); // Cerrar el modal devolviendo datos al componente padre
  }
}
```
