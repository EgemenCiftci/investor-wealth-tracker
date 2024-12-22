import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);

  openDialog(title: string, content: string): MatDialogRef<DialogComponent, boolean> {
    return this.dialog.open(DialogComponent, { data: { title: title, content: content } });
  }
}
