import { Pipe, PipeTransform, inject } from '@angular/core';
import { Entry } from '../models/entry';
import { EntriesService } from '../services/entries.service';

@Pipe({
  name: 'total',
  standalone: true
})
export class TotalPipe implements PipeTransform {
  private readonly entriesService = inject(EntriesService);

  transform(entry: Entry, arg: 'w' | 'a' | 'd'): number {
    switch (arg) {
      case 'w':
        return this.entriesService.getTotalNetWorth(entry);
      case 'a':
        return this.entriesService.getTotalAssets(entry);
      case 'd':
        return this.entriesService.getTotalDebts(entry);
    }
  }
}
