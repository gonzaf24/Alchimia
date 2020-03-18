import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { SearchPipe } from './pipes/search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthenticationGuard } from './services/authentication.guard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatCardModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { PublicComponent } from './public/public.component';
import { EditarUsuarioComponent } from './modales/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './modales/crear-usuario/crear-usuario.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { GaleriaComponent } from './galeria/galeria.component';
import { AlbumComponent } from './album/album.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { CrearAlbumComponent } from './modales/crear-album/crear-album.component';
import { EditarAlbumComponent } from './modales/editar-album/editar-album.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { EditarActividadComponent } from './modales/editar-actividad/editar-actividad.component';
import { CrearActividadComponent } from './modales/crear-actividad/crear-actividad.component';
import { registerLocaleData } from '@angular/common';
import { ActividadComponent } from './actividad/actividad.component';
import { PublicPerfilComponent } from './public/public-perfil/public-perfil.component';
import { PublicActividadComponent } from './public/public-actividad/public-actividad.component';
import { PublicAlbumComponent } from './public/public-album/public-album.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'public', component: PublicComponent },
  { path: 'public/public-perfil/:email', component: PublicPerfilComponent },
  { path: 'public/public-actividad/:uid', component: PublicActividadComponent },
  { path: 'public/public-album/:uid', component: PublicAlbumComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'galeria', component: GaleriaComponent, canActivate: [AuthenticationGuard] },
  { path: 'album/:uid', component: AlbumComponent, canActivate: [AuthenticationGuard] },
  { path: 'actividades', component: ActividadesComponent, canActivate: [AuthenticationGuard] },
  { path: 'mensajes', component: MensajesComponent, canActivate: [AuthenticationGuard] },
  { path: 'actividad/:uid', component: ActividadComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    MenuComponent,
    SearchPipe,
    DropdownComponent,
    PublicComponent,
    EditarUsuarioComponent,
    CrearUsuarioComponent,
    GaleriaComponent,
    AlbumComponent,
    CrearAlbumComponent,
    EditarAlbumComponent,
    ActividadesComponent,
    EditarActividadComponent,
    CrearActividadComponent,
    ActividadComponent,
    PublicPerfilComponent,
    PublicActividadComponent,
    PublicAlbumComponent,
    MensajesComponent
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
    BootstrapModalModule.forRoot({ container: document.body }),
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
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MDBBootstrapModule.forRoot(),
    MatCardModule,
    NgxGalleryModule,
    MatTableModule,
    MatGridListModule,
    MatTooltipModule

  ],

  providers: [CountriesService,
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
    { provide: LOCALE_ID, useValue: 'es' }
  ],

  bootstrap: [AppComponent],
  entryComponents: [CrearUsuarioComponent, EditarUsuarioComponent, CrearAlbumComponent, EditarAlbumComponent, EditarActividadComponent, CrearActividadComponent]
})

export class AppModule { }