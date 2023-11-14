import { Component } from '@angular/core';
import { Entry } from 'src/app/models/entry';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private entriesService: EntriesService) {
  }
}
