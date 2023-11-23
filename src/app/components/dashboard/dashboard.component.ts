import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { EntriesService } from 'src/app/services/entries.service';
import { RatesService } from 'src/app/services/rates.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isBusy = false;
  options!: EChartsOption;

  constructor(private entriesService: EntriesService,
    private ratesService: RatesService,
    private snackBarService: SnackBarService) {
  }

  async ngOnInit() {
    const data = await this.getData();

    this.options = {
      tooltip: {},
      legend: {
        show: true,
        textStyle: {
          color: 'white'
        }
      },
      xAxis: {
        name: 'Date',
        data: data.map(f => f.x),
      },
      yAxis: {
        name: `Wealth (${this.ratesService.base})`
      },
      series: [
        {
          name: 'Total Wealth',
          type: 'line',
          color: 'blue',
          data: data.map(f => f.w),
        },
        {
          name: 'Assets',
          type: 'line',
          color: 'green',
          data: data.map(f => f.a),
        },
        {
          name: 'Debts',
          type: 'line',
          color: 'red',
          data: data.map(f => f.d),
        }
      ],
      animationEasing: 'elasticOut',
    };
  }

  private async getData(): Promise<Array<{ x: string, w: number, a: number, d: number }>> {
    let data = Array<{ x: string, w: number, a: number, d: number }>();
    try {
      this.isBusy = true;
      const entries = await this.entriesService.getEntries();
      if (entries) {
        data = entries.map(entry => ({
          x: entry.date,
          w: this.entriesService.getTotalNetWorth(entry),
          a: this.entriesService.getTotalAssets(entry),
          d: this.entriesService.getTotalDebts(entry)
        }));
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
      return data;
    }
  }
}
