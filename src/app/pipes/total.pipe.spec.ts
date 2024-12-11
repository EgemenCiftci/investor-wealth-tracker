import { inject } from '@angular/core';
import { EntriesService } from '../services/entries.service';
import { TotalPipe } from './total.pipe';

const entriesService = inject(EntriesService);

describe('TotalPipe', () => {
  it('create an instance', (entriesService) => {
    const pipe = new TotalPipe();
    expect(pipe).toBeTruthy();
  });
});
