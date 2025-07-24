import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { loadData } from 'src/app/actions/entries.actions';
import { Observable, map, share } from 'rxjs';
import { Entry } from 'src/app/models/entry';
import { AppState } from 'src/app/reducers/entries.reducer';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardFooter } from '@angular/material/card';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe, NgClass, PercentPipe } from '@angular/common';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TimelineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([GridComponent, LineChart, TooltipComponent, CanvasRenderer, LegendComponent, TimelineComponent]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
  ],
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit {
  private readonly entriesService = inject(EntriesService);
  private readonly ratesService = inject(RatesService);
  private readonly store = inject<Store<AppState>>(Store);

  share$: Observable<Entry[]> = this.store.select(x => x.entriesReducer.entries).pipe(share());
  options$: Observable<EChartsCoreOption> = this.share$.pipe(
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

  private getOptions(data: { x: Date, w: number, a: number, d: number }[]): EChartsCoreOption {
    return {
      baseOption: {
        legend: {
          show: true,
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {},
        xAxis: {
          name: 'Date',
          data: data?.map(f => this.entriesService.formatDate(f.x)),
        },
        yAxis: {
          name: `Wealth (${this.ratesService.base})`
        },
        animationEasing: 'elasticOut',
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
        ]
      }
    };
  }
}
