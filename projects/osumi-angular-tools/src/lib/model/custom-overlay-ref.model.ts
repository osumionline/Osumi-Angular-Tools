import { OverlayRef } from "@angular/cdk/overlay";
import { Type } from "@angular/core";
import { Subject } from "rxjs";
import { OverlayCloseEvent } from '../interfaces/modals.interface';

// R = Response Data Type, T = Data passed to Modal Type
export default class CustomOverlayRef<R = any, T = any> {
  afterClosed$ = new Subject<OverlayCloseEvent<R | null>>();

  constructor(
    public overlay: OverlayRef,
    public content: Type<any>,
    public data: T,
    public closeOnBackdropCLick: boolean = true
  ) {
    if (closeOnBackdropCLick) {
      overlay.backdropClick().subscribe({
        next: () => {
          this._close("backdropClick", null);
        },
      });
    }
  }

  close(data?: any): void {
    this._close("close", data!);
  }

  private _close(type: "backdropClick" | "close", data: R | null): void {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });

    this.afterClosed$.complete();
  }
}
