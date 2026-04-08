import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { addEntry, copyAndAddEntry, copyAndAddEntryComplete, loadData, removeEntry, saveEntries } from '../../actions/entries.actions';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardFooter } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AppState } from '../../reducers/entries.reducer';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridApi, GridReadyEvent, RowSelectionOptions, SelectionChangedEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { Entry } from '../../models/entry';
import { take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

ModuleRegistry.registerModules([AllCommunityModule]);

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
    FormsModule,
    MatButton,
    MatIcon,
    MatCardFooter,
    MatProgressBar,
    AsyncPipe,
    AgGridAngular
  ]
})
export class EntriesComponent implements OnInit {
  private readonly ratesService = inject(RatesService);
  private readonly store = inject<Store<AppState>>(Store);
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  trackByFn = (index: number, _item: any) => index;
  entries$ = this.store.select(x => x.entriesReducer.entries);
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);
  selectedEntry: Entry | null = null;
  gridApi: GridApi | null = null;
  colDefs: ColDef[] = [
    { field: "date", sort: 'desc' },
    { field: "rates", valueGetter: (params) => Object.keys(params.data?.rates || {}).length },
    { field: "assets", valueGetter: (params) => params.data?.assets?.length ?? 0 },
    { field: "debts", valueGetter: (params) => params.data?.debts?.length ?? 0 },
  ];
  theme = themeQuartz
    .withParams(
      {
        backgroundColor: "#1a1a1a",
        foregroundColor: "#ffffff",
        browserColorScheme: "dark",
      },
      "dark",
    );
  rowSelection: RowSelectionOptions = {
    mode: 'singleRow',
    checkboxes: true,
    enableClickSelection: true,
  };

  ngOnInit() {
    document.body.dataset['agThemeMode'] = "dark";
    this.store.dispatch(loadData());
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    this.gridApi.autoSizeAllColumns();
  }

  addEntry() {
    this.store.dispatch(addEntry({ base: this.ratesService.base }));
    this.store.select(x => x.entriesReducer.entries).pipe(
      take(1)
    ).subscribe(entries => {
      const newEntry = entries.at(-1);
      this.router.navigate(['/entry', newEntry?.date.getTime()]);
    });
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedEntry = event.selectedNodes?.map(node => node.data as Entry)[0] || null;
  }

  editEntry() {
    this.router.navigate(['/entry', this.selectedEntry?.date.getTime()]);
  }

  copyAndAddEntry() {
    const newDate = new Date();
    this.actions$.pipe(
      ofType(copyAndAddEntryComplete),
      take(1)
    ).subscribe(() =>
      this.router.navigate(['/entry', newDate.getTime()])
    );
    const entryDate = this.selectedEntry?.date ?? new Date();
    this.store.dispatch(copyAndAddEntry({ entryDate, newDate }));
  }

  removeEntry() {
    this.store.dispatch(removeEntry({ entryDate: this.selectedEntry?.date ?? new Date() }));
    this.store.dispatch(saveEntries({ skipDialog: true }));
  }
}
