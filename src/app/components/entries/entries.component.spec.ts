import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntriesComponent } from './entries.component';
import { EntriesService } from 'src/app/services/entries.service';
import { RatesService } from 'src/app/services/rates.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialog.service';

describe('EntriesComponent', () => {
  let component: EntriesComponent;
  let fixture: ComponentFixture<EntriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntriesComponent],
      providers: [EntriesService, RatesService, SnackBarService, DialogService]
    });
    fixture = TestBed.createComponent(EntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
