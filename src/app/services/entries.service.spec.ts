import { TestBed } from '@angular/core/testing';
import { EntriesService } from './entries.service';
import { Database } from '@angular/fire/database';
import { AuthenticationService } from './authentication.service';

describe('EntriesService', () => {
  let service: EntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Database, AuthenticationService]
    });
    service = TestBed.inject(EntriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
