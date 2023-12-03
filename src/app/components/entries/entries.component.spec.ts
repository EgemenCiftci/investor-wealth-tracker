import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntriesComponent } from './entries.component';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { DialogService } from '../../services/dialog.service';

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
