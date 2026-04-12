import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { loadData } from '../../actions/entries.actions';
import { Observable, map, share } from 'rxjs';
import { Entry } from '../../models/entry';
import { AppState } from '../../reducers/entries.reducer';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardFooter } from '@angular/material/card';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe, NgClass, PercentPipe, CurrencyPipe } from '@angular/common';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TimelineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { SnackBarService } from '../../services/snack-bar.service';
import { GeminiService } from '../../services/gemini.service';
import { SettingsService } from '../../services/settings.service';

echarts.use([GridComponent, LineChart, PieChart, TooltipComponent, CanvasRenderer, LegendComponent, TimelineComponent]);

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
    MatIcon,
    MatIconButton,
    MatTooltip,
    AsyncPipe,
    NgClass,
    PercentPipe,
    CurrencyPipe
  ],
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit {
  private readonly entriesService = inject(EntriesService);
  private readonly ratesService = inject(RatesService);
  private readonly geminiService = inject(GeminiService);
  private readonly store = inject<Store<AppState>>(Store);
  private readonly snackBarService = inject(SnackBarService);
  private readonly settingsService = inject(SettingsService);

  share$: Observable<Entry[]> = this.store.select(x => x.entriesReducer.entries).pipe(share());
  options$: Observable<EChartsCoreOption> = this.share$.pipe(
    map(entries => this.getData(entries)),
    map(data => this.getOptions(data)));
  allocationOptions$: Observable<EChartsCoreOption> = this.share$.pipe(
    map(entries => entries.length > 0 ? this.getAllocationByTypeOptions(entries.at(-1)!) : {}));
  allocationByNameOptions$: Observable<EChartsCoreOption> = this.share$.pipe(
    map(entries => entries.length > 0 ? this.getAllocationByNameOptions(entries.at(-1)!) : {}));
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);
  oneDayReturn$: Observable<number> = this.share$.pipe(
    map(entries => this.entriesService.getDailyTotalWorthPercentage(entries[0], entries.at(-1)!)));
  oneWeekReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 7));
  oneMonthReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 30));
  oneYearReturn$: Observable<number> = this.oneDayReturn$.pipe(
    map(x => x * 365));
  currentNetWorth$: Observable<number> = this.share$.pipe(
    map(entries => entries.length > 0 ? this.entriesService.getTotalNetWorth(entries.at(-1)!) : 0));
  totalAssets$: Observable<number> = this.share$.pipe(
    map(entries => entries.length > 0 ? this.entriesService.getTotalAssets(entries.at(-1)!) : 0));
  totalDebt$: Observable<number> = this.share$.pipe(
    map(entries => entries.length > 0 ? this.entriesService.getTotalDebts(entries.at(-1)!) : 0));

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
          bottom: 0,
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

  private getAllocationByTypeOptions(entry: Entry): EChartsCoreOption {
    const allocation = this.entriesService.getAssetsByType(entry);
    const data = Object.entries(allocation).map(([type, value]) => ({
      value,
      name: this.formatAssetType(type)
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (param: any) => {
          if (param.componentSubType === 'pie') {
            return `${param.name}: ${(param.percent).toFixed(1)}%`;
          }
          return '';
        }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: 'white'
        }
      },
      series: [
        {
          name: 'Asset Allocation By Type',
          type: 'pie',
          radius: '40%',
          data: data,
          label: {
            color: 'white'
          }
        }
      ]
    };
  }

  private formatAssetType(type: string): string {
    const formatMap: { [key: string]: string } = {
      liquid: 'Liquid',
      longTerm: 'Long-Term',
      pensionFundsAndSimilar: 'Pension Funds & Similar'
    };
    return formatMap[type] || type;
  }

  private getAllocationByNameOptions(entry: Entry): EChartsCoreOption {
    const allocationByName: { [name: string]: number } = {};
    entry.assets?.forEach(asset => {
      const rate = entry.rates[asset.currencyCode] ?? 0;
      if (rate !== 0) {
        const amount = asset.value / rate;
        allocationByName[asset.name] = (allocationByName[asset.name] ?? 0) + amount;
      }
    });

    const data = Object.entries(allocationByName).map(([name, value]) => ({
      value,
      name
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (param: any) => {
          if (param.componentSubType === 'pie') {
            return `${param.name}: ${(param.percent).toFixed(1)}%`;
          }
          return '';
        }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: 'white'
        }
      },
      series: [
        {
          name: 'Asset Allocation By Name',
          type: 'pie',
          radius: '40%',
          data: data,
          label: {
            color: 'white'
          }
        }
      ]
    };
  }

  async getInsight() {
    const settings = await this.settingsService.getSettings();
    if (!settings.geminiApiKey) {
      this.snackBarService.open('Gemini API key is not set. Please set it in the settings.', 0);
      return;
    }
    this.snackBarService.open('Generating insight...', 0);
    const entries = await this.entriesService.getEntries();
    const snapshot = JSON.stringify(entries.at(-1));
    try {
      const insight = await this.geminiService.generateInsight(snapshot);
      this.snackBarService.close();
      this.snackBarService.open(insight, 0);
    } catch (error) {
      console.error('Error generating insight:', error);
      this.snackBarService.close();
      this.snackBarService.open('Failed to generate insight.', 0);
    }
  }
}

