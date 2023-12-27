import { inject } from '@angular/core';
import { EntriesService } from '../services/entries.service';
import { TotalPipe } from './total.pipe';

describe('TotalPipe', () => {
  it('create an instance', () => {
    const pipe = new TotalPipe(inject(EntriesService));
    expect(pipe).toBeTruthy();
  });
});
