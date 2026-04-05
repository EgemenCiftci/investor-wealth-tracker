import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { addEntry, saveEntries, cancelEntries, loadData } from '../../actions/entries.actions';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import { MatAccordion } from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AppState } from '../../reducers/entries.reducer';
import { EntryComponent } from '../entry/entry.component';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatAccordion,
    FormsModule,
    MatButton,
    MatIcon,
    MatCardActions,
    MatCardFooter,
    MatProgressBar,
    AsyncPipe,
    EntryComponent
  ]
})
export class EntriesComponent implements OnInit {
  private readonly ratesService = inject(RatesService);
  private readonly store = inject<Store<AppState>>(Store);
  trackByFn = (index: number, _item: any) => index;
  entries$ = this.store.select(x => x.entriesReducer.entries);
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);

  ngOnInit() {
    this.store.dispatch(loadData());
  }

  save() {
    this.store.dispatch(saveEntries());
  }

  cancel() {
    this.store.dispatch(cancelEntries());
  }

  addEntry() {
    this.store.dispatch(addEntry({ base: this.ratesService.base }));
  }
}
