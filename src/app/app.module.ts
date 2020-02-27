import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import {RouterModule, Routes} from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import {SearchPipe} from './pipes/search';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { AuthenticationGuard } from './services/authentication.guard';
import { ConversationComponent } from './conversation/conversation.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { SolicitudesAmistadComponent } from './modales/solicitudes-amistad/solicitudes-amistad.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CountriesService } from './services/countries.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';


const appRoutes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'conversation/:uid', component: ConversationComponent , canActivate: [AuthenticationGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    MenuComponent,
    SearchPipe,
    SolicitudesAmistadComponent,
    ConversationComponent,
    ContactComponent,
    DropdownComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, //configuracion de firebase
    AngularFireAuthModule, //configuracion de firebase
    AngularFireStorageModule, //configuracion de firebase
    AngularFireDatabaseModule, //configuracion de firebase
    ImageCropperModule, //componente para modifcar imagenes
    NgbModule,
    BootstrapModalModule.forRoot({container:document.body}),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule
  ],

  providers: [CountriesService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],

  bootstrap: [AppComponent],
  entryComponents: [SolicitudesAmistadComponent]
})
export class AppModule { }
