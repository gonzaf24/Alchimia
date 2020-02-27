import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { UsuarioService } from '../../services/usuario.service';
import { SolicitudesAmistadService } from '../../services/solicitudes-amistad.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CountriesService } from 'src/app/services/countries.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}
export interface Sex {
  value: string;
  viewValue: string;
}
export interface Pais {
  value: string;
  viewValue: string;
}
export interface Ciudad {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-solicitudes-amistad',
  templateUrl: './solicitudes-amistad.component.html',
  styleUrls: ['./solicitudes-amistad.component.css'],
  providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}]
})

export class SolicitudesAmistadComponent extends DialogComponent<PromptModel, any> implements PromptModel {
  scope: any;
  agregarlo: string = 'si';
  currentRequest: any;
  userSolicitud: User;

  amigos: User[];
  query: string = '';
  userLoged: User;
  amigoEmail: string = '';

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  fiveFormGroup: FormGroup;
  countryInfo: any[] = [];
  stateInfo: any[] = [];
  cityInfo: any[] = [];
  pais: string;
  ciudad: string;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  profesionesList: string[] = [];
  profesionCtrl = new FormControl();
  filteredProfesiones: Observable<string[]>;
  
  todasLasProfesiones: string[] = [ 'Meditacion', 'Moda', 'Eventos', 'Educacion','Musica', 'Arte' ,'Ingeniero'];

  visibleInteres = true;
  selectableInteres = true;
  removableInteres = true;
  separatorKeysCodesInteres: number[] = [ENTER, COMMA];
  profesionesListInteres: string[] = [];
  profesionInteresCtrl = new FormControl();
  filteredProfesionesInteres: Observable<string[]>;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  user: User;

  sexs: Sex[] = [
    {value: 'hombre', viewValue: 'Sr'},
    {value: 'mujer', viewValue: 'Sra'},
    {value: 'todes', viewValue: 'T@des'}
  ];

   @ViewChild('profesionesInput',{ static: false }) profesionesInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto',{ static: false }) matAutocompleteProfesion: MatAutocomplete;
   @ViewChild('profesionesInteresInput',{ static: false }) profesionesInteresInput: ElementRef<HTMLInputElement>;
   @ViewChild('autoInteres',{ static: false }) matAutocompleteProfesionInteres: MatAutocomplete;

  constructor(public dialogService: DialogService, 
              private userService: UsuarioService,
              private usuarioService: UsuarioService,
              private authenticationService: AuthenticationService, 
              private router: Router, 
              private country:CountriesService,
              private solicitudesAmistadService: SolicitudesAmistadService,
              private _formBuilder: FormBuilder, 
              private firebaseStorage: AngularFireStorage) {
    super(dialogService);

    this.filteredProfesiones = this.profesionCtrl.valueChanges.pipe(
      startWith(null),
      map((prof: string | null) => prof ? this._filter(prof) : this.todasLasProfesiones.slice()));

    this.filteredProfesionesInteres = this.profesionInteresCtrl.valueChanges.pipe(
      startWith(null),
      map((profInteres: string | null) => profInteres ? this._filter(profInteres) : this.todasLasProfesiones.slice()));
  }

  logout() {
    this.authenticationService.logOut().then( ()=>{
    this.router.navigate(['login']);
    }).catch( (error) =>{
      console.log(error);
    });
  }

  ngOnInit(){
    this.getCountries();
    this.firstFormGroup = this._formBuilder.group({
    });
    this.secondFormGroup = this._formBuilder.group({
      sexo: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['',Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      telefono: ['', Validators.required]
    });
    this.fourFormGroup = this._formBuilder.group({
      profesiones:[ [], ],
      profesionesInteres:[ [] , ]
    });
    this.fiveFormGroup = this._formBuilder.group({
      avatar:['', Validators.required],
    });
    this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe( (data: User) => {
      this.userSolicitud = data;
    });
  }


  guardarCambios(){
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((p) => {
          this.userService.guardarImagenPerfil(p, this.user.uid).then(() => {
            alert('Avatar subido correctamentne');
          }).catch((error) => {
            alert('Hubo un error al tratar de subir la imagen');
            console.log(error);
          });
        });
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.userService.editarUsuario(this.user).then(() => {
        alert('Cambios guardados!');
      }).catch((error) => {
        alert('Hubo un error');
        console.log(error);
      });
    }
  }

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}
imageLoaded() {
}
cropperReady() {
}
loadImageFailed() {
}

addProfesion(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  // Agregar our profesion
  if ((value || '').trim()) {
    this.profesionesList.push(value.trim());
    this.fourFormGroup.updateValueAndValidity();
  }
  // Reset the input value
  if (input) {
    input.value = '';
  }
  this.profesionCtrl.setValue(null);
}

addProfesionInteres(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  if ((value || '').trim()) {
    this.profesionesListInteres.push(value.trim());
    this.fourFormGroup.updateValueAndValidity();
  }
  if (input) {
    input.value = '';
  }
  this.profesionInteresCtrl.setValue(null);
}

removeProf(prof: string): void {
  const index = this.profesionesList.indexOf(prof);
  if (index >= 0) {
    this.profesionesList.splice(index, 1);
  }
}

removeProfInteres(prof: string): void {
  const index = this.profesionesListInteres.indexOf(prof);
  if (index >= 0) {
    this.profesionesListInteres.splice(index, 1);
  }
}

selectedProf(event: MatAutocompleteSelectedEvent): void {
  this.profesionesList.push(event.option.viewValue);
  this.profesionesInput.nativeElement.value = '';
  this.profesionCtrl.setValue(null);
}

selectedProfInteres(event: MatAutocompleteSelectedEvent): void {
  this.profesionesListInteres.push(event.option.viewValue);
  this.profesionesInteresInput.nativeElement.value = '';
  this.profesionInteresCtrl.setValue(null);
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.todasLasProfesiones.filter(prof => prof.toLowerCase().indexOf(filterValue) === 0);
}

getCountries(){
  this.country.allCountries().
  subscribe(
    data2 => {
      this.countryInfo=data2.Countries;
    },
    err => console.log(err),
    () => console.log('complete')
  )
}

onChangeCountry(countryValue) {
  this.stateInfo=this.countryInfo[countryValue].States;
  this.cityInfo=this.stateInfo[0].Cities;
  console.log(this.cityInfo);
}

onChangeState(stateValue) {
  this.cityInfo=this.stateInfo[stateValue].Cities;
  //console.log(this.cityInfo);
}


accept() {
  if (this.agregarlo == 'si') {
    this.solicitudesAmistadService.setSolicitudestStatus(this.currentRequest, 'aceptado').then((data) => {
      console.log(data);
      this.usuarioService.agregarAmigo(this.scope.userLogged.uid, this.currentRequest.sender).then(() => {
      });
    }).catch((error) => {
      console.log(error);
    });
  } else if (this.agregarlo == 'no') {
    this.solicitudesAmistadService.setSolicitudestStatus(this.currentRequest, 'rechazado').then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  } else if (this.agregarlo == 'pendiente') {
    this.solicitudesAmistadService.setSolicitudestStatus(this.currentRequest, 'pendiente').then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }
}

}
