import { Component } from '@angular/core';
import { AssetTypes } from 'src/app/enums/asset-types';
import { DebtTypes } from 'src/app/enums/debt-types';
import { Asset } from 'src/app/models/asset';
import { Debt } from 'src/app/models/debt';
import { Entry } from 'src/app/models/entry';
import { DialogService } from 'src/app/services/dialog.service';
import { EntriesService } from 'src/app/services/entries.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent {
  entries: Entry[] | undefined = undefined;
  isBusy = false;

  constructor(public entriesService: EntriesService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService) {
    this.entriesService.init();
    this.load();
  }

  async save() {
    try {
      this.isBusy = true;
      this.dialogService.openDialog('Save', 'All changes will be saved. Do you want to continue?', [
        {
          content: 'Cancel', isInitialFocus: false, click: () => { }
        },
        {
          content: 'Ok', isInitialFocus: true, click: async () => {
            await this.entriesService.setEntries(this.entries ?? []);
            this.snackBarService.showSnackBar('Saved successfully!');
          }
        }]);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async load() {
    try {
      this.isBusy = true;
      this.entries = await this.entriesService.getEntries();
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async cancel() {
    try {
      this.isBusy = true;
      this.dialogService.openDialog('Cancel', 'All changes will be reverted. Do you want to continue?', [
        {
          content: 'Cancel', isInitialFocus: false, click: () => { }
        },
        {
          content: 'Ok', isInitialFocus: true, click: async () => {
            this.entries = await this.entriesService.getEntries();
          }
        }]);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addEntry() {
    try {
      this.isBusy = true;
      if (!this.entries) {
        this.entries = [];
      }
      this.entries.push(new Entry(this.formatDate(new Date()), [], []));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  copyAndAddEntry(entry: Entry) {
    try {
      this.isBusy = true;
      if (!this.entries) {
        this.entries = [];
      }
      const assets = entry.assets.map(a => new Asset(a.type, a.name, a.value));
      const debts = entry.debts.map(d => new Debt(d.type, d.name, d.value));
      this.entries.push(new Entry(this.formatDate(new Date()), assets, debts));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addAsset(entry: Entry) {
    try {
      this.isBusy = true;
      if (!entry.assets)
        entry.assets = [];
      entry.assets.push(new Asset(AssetTypes.liquid, '', 0));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addDebt(entry: Entry) {
    try {
      this.isBusy = true;
      if (!entry.debts)
        entry.debts = [];
      entry.debts.push(new Debt(DebtTypes.shortTerm, '', 0));
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

  removeEntry(entry: Entry) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  removeAsset(entry: Entry, asset: Asset) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const entryIndex = this.entries.indexOf(entry);
        const assetIndex = entry.assets.indexOf(asset);
        this.entries[entryIndex].assets.splice(assetIndex, 1);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  removeDebt(entry: Entry, debt: Debt) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const entryIndex = this.entries.indexOf(entry);
        const debtIndex = entry.debts.indexOf(debt);
        this.entries[entryIndex].debts.splice(debtIndex, 1);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
