import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  showSnackBar(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
}
