import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, content: string, actions: Array<{ content: string, isInitialFocus: boolean, click: () => any }> }) {
  }

  click(action: { content: string, isInitialFocus: boolean, click: () => any }) {
    try {
      action.click();
    } catch (error) {
      console.error(error);
    }
  }
}
