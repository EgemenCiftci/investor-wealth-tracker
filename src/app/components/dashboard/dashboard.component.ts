import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { loadData } from 'src/app/actions/entries.actions';
import { Observable, map, share } from 'rxjs';
import { Entry } from 'src/app/models/entry';
import { AppState } from 'src/app/reducers/entries.reducer';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardFooter } from '@angular/material/card';
import { NgxEchartsDirective } from 'ngx-echarts';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe, NgClass, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    NgxEchartsDirective,
    MatCardFooter,
    MatProgressBar,
    AsyncPipe,
    NgClass,
    PercentPipe
  ]
})
export class DashboardComponent implements OnInit {
  private readonly entriesService = inject(EntriesService);
  private readonly ratesService = inject(RatesService);
  private readonly store = inject<Store<AppState>>(Store);

  share$: Observable<Entry[]> = this.store.select(x => x.entriesReducer.entries).pipe(share());
  options$: Observable<EChartsOption> = this.share$.pipe(
    map(entries => this.getData(entries)),
    map(data => this.getOptions(data)));
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);
  oneDayReturn$: Observable<number> = this.share$.pipe(
    map(entries => this.entriesService.getDailyTotalWorthPercentage(entries[0], entries[entries.length - 1])));
  oneWeekReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 7));
  oneMonthReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 30));
  oneYearReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 365));

  ngOnInit() {
    this.store.dispatch(loadData());
  }

  private getData(entries: Entry[]): ({ x: Date, w: number, a: number, d: number })[] {
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
