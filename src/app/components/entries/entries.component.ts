import { Component } from '@angular/core';
import { AssetTypes } from 'src/app/enums/asset-types';
import { DebtTypes } from 'src/app/enums/debt-types';
import { Asset } from 'src/app/models/asset';
import { Debt } from 'src/app/models/debt';
import { Entry } from 'src/app/models/entry';
import { EntriesService } from 'src/app/services/entries.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent {
  entries: Entry[] = [];
  isBusy = false;

  constructor(private entriesService: EntriesService,
    private snackBarService: SnackBarService) {
    this.entriesService.init();
    this.cancel();
  }

  async save() {
    try {
      this.isBusy = true;
      await this.entriesService.setEntries(this.entries);
      this.snackBarService.showSnackBar('Saved successfully!');
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async cancel() {
    try {
      this.isBusy = true;
      this.entries = await this.entriesService.getEntries();
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  getValueSum(array: Asset[] | Debt[]): number {
    return array.map(x => x.value).reduce((x, y) => x + y, 0);
  }

  getTotalNetWorth(entry: Entry): number {
    return this.getValueSum(entry.assets) - this.getValueSum(entry.debts);
  }

  addEntry(entries: Entry[]){
    try {
      this.isBusy = true;
      entries.push(new Entry(this.formatDate(new Date()), [], []))
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addAsset(assets: Asset[]){
    try {
      this.isBusy = true;
      assets.push(new Asset(AssetTypes.liquid, '', 0));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addDebt(debts: Debt[]){
    try {
      this.isBusy = true;
      debts.push(new Debt(DebtTypes.shortTerm, '', 0));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  onDateChange(event: any, entry: Entry) {
    entry.date = this.formatDate(event.value);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}
