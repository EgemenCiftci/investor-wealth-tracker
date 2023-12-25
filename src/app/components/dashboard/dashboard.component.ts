import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { loadData } from 'src/app/actions/entries.actions';
import { Observable, map } from 'rxjs';
import { Entry } from 'src/app/models/entry';
import { AppState } from 'src/app/reducers/entries.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  options$: Observable<EChartsOption> = this.store.select(x => x.entriesReducer.entries).pipe(
    map(entries => this.getData(entries)),
    map(data => this.getOptions(data)));
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);

  constructor(private entriesService: EntriesService,
    private ratesService: RatesService,
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(loadData());
  }

  private getData(entries: Entry[]): ({ x: Date, w: number, a: number, d: number })[] {
    console.log(entries);
    if (!Array.isArray(entries)) {
      return [];
    }

    return entries?.map(entry => ({
      x: entry.date,
      w: this.entriesService.getTotalNetWorth(entry),
      a: this.entriesService.getTotalAssets(entry),
      d: this.entriesService.getTotalDebts(entry)
    }));
  }

  private getOptions(data: { x: Date, w: number, a: number, d: number }[]): EChartsOption {
    return {
      tooltip: {},
      legend: {
        show: true,
        textStyle: {
          color: 'white'
        }
      },
      xAxis: {
        name: 'Date',
        data: data?.map(f => this.entriesService.formatDate(f.x)),
      },
      yAxis: {
        name: `Wealth (${this.ratesService.base})`
      },
      series: [
        {
          name: 'Total Wealth',
          type: 'line',
          color: 'blue',
          data: data?.map(f => f.w),
        },
        {
          name: 'Assets',
          type: 'line',
          color: 'green',
          data: data?.map(f => f.a),
        },
        {
          name: 'Debts',
          type: 'line',
          color: 'red',
          data: data?.map(f => f.d),
        }
      ],
      animationEasing: 'elasticOut',
    };
  }
}
