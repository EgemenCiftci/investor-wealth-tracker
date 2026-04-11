import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private readonly snackBar = inject(MatSnackBar);
  private ref: MatSnackBarRef<TextOnlySnackBar> | null = null;

  open(message: string, duration: number = 3000) {
    this.ref = this.snackBar.open(message, 'X', { duration });
  }

  close() {
    if (this.ref) {
      this.ref.dismiss();
      this.ref = null;
    }
  }
}