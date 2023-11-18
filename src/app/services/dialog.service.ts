import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(title: string, content: string, actions: Array<{ content: string, isInitialFocus: boolean, click: () => any }>): void {
    this.dialog.open(DialogComponent, { data: { title: title, content: content, actions: actions } });
  }
}
