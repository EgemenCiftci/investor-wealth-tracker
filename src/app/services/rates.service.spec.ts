import { TestBed } from '@angular/core/testing';
import { RatesService } from './rates.service';
import { HttpClient } from '@angular/common/http';

describe('RatesService', () => {
  let service: RatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient]
    });
    service = TestBed.inject(RatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
