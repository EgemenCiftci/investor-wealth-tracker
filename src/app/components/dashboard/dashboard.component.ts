import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { EntriesService } from 'src/app/services/entries.service';
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
    private snackBarService: SnackBarService) {
    this.entriesService.init();
  }

  async ngOnInit() {
    const data = await this.getData();

    this.options = {
      tooltip:{},
      xAxis: {
        data: data.map(f => f.x),
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'line',
          type: 'line',
          data: data.map(f => f.y),
          animationDelay: idx => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

  private async getData(): Promise<Array<{ x: string, y: number }>> {
    let data = Array<{ x: string, y: number }>();
    try {
      this.isBusy = true;
      const entries = await this.entriesService.getEntries();
      if (entries) {
        data = entries.map(entry => ({ x: entry.date, y: this.entriesService.getTotalNetWorth(entry) }));
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
      return data;
    }
  }
}
