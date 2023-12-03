import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { EntriesService } from '../../services/entries.service';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponent],
      providers: [SnackBarService, AuthenticationService, Router, DialogService, EntriesService]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
