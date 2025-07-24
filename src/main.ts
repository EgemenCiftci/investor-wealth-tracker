import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from './environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideEchartsCore } from 'ngx-echarts';
import { StoreModule } from '@ngrx/store';
import { entriesReducer } from './app/reducers/entries.reducer';
import { progressReducer } from './app/reducers/progress.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EntriesEffects } from './app/effects/entries.effects';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import * as echarts from 'echarts/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            AppRoutingModule,
            FormsModule,
            MatToolbarModule,
            MatIconModule,
            MatButtonModule,
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatCardModule,
            MatProgressBarModule,
            MatSnackBarModule,
            MatTooltipModule,
            MatMenuModule,
            MatExpansionModule,
            MatCheckboxModule,
            MatDialogModule,
            MatAutocompleteModule,
            StoreModule.forRoot({ entriesReducer, progressReducer }),
            EffectsModule.forRoot([EntriesEffects])),
        provideEchartsCore({ echarts }),
        provideHttpClient(withInterceptorsFromDi()),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        provideAnimations()
    ]
}).catch(err => console.error(err));