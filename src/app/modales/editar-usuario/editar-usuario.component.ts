import { Component, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { UsuarioService } from '../../services/usuario.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CountriesService } from 'src/app/services/countries.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DatePipe } from '@angular/common';

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
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  providers: [DatePipe,{ provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}]
})

export class EditarUsuarioComponent  extends DialogComponent<PromptModel, any> implements PromptModel {

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

  prueba:string;

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
  selectedCountry: string;

  userToEdit: User;

  sexs: Sex[] = [
    {value: 'Sr', viewValue: 'Sr'},
    {value: 'Srta', viewValue: 'Srta'},
    {value: 'T@des', viewValue: 'T@des'}
  ];

   @ViewChild('profesionesInput',{ static: false }) profesionesInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto',{ static: false }) matAutocompleteProfesion: MatAutocomplete;
   @ViewChild('profesionesInteresInput',{ static: false }) profesionesInteresInput: ElementRef<HTMLInputElement>;
   @ViewChild('autoInteres',{ static: false }) matAutocompleteProfesionInteres: MatAutocomplete;

constructor(public dialogService: DialogService, 
              private userService: UsuarioService,
              private country:CountriesService,
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

formatDate(e) {
    var d = new Date(e.target.value); 
    var fecha =new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaNacimiento').setValue(fecha);
}

ngOnInit(){
    this.getCountries();
    this.firstFormGroup = this._formBuilder.group({
    });
    this.secondFormGroup = this._formBuilder.group({
      sexo: [this.scope.userLogged.sexo, Validators.required],
      nombre: [this.scope.userLogged.nombre, Validators.required],
      apellido: [this.scope.userLogged.apellido, Validators.required],
      fechaNacimiento: [this.scope.userLogged.fechaNacimiento,Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      pais: [, Validators.required],
      ciudad: [, Validators.required],
      telefono: [this.scope.userLogged.telefono, Validators.required]
    });
    this.fourFormGroup = this._formBuilder.group({
      profesiones:[ this.scope.userLogged.profesiones, ],
      profesionesInteres:[ this.scope.userLogged.intereses , ]
    });
    this.fiveFormGroup = this._formBuilder.group({
      avatar:['', Validators.required],
    });
    //revisar
    this.userService.getUserById(this.currentRequest.uid).valueChanges().subscribe( (data: User) => {
      this.userToEdit = data;
    });
    this.thirdFormGroup.get('pais').setValue(this.scope.userLogged.pais);
    this.thirdFormGroup.get('ciudad').setValue(this.scope.userLogged.estadoCiudad);
    this.selectedCountry = this.scope.userLogged.pais;
    this.ciudad = this.scope.userLogged.estadoCiudad;
    this.profesionesList = this.scope.userLogged.profesiones;
    if(!this.profesionesList || this.profesionesList.length==0){
      this.profesionesList = [];
    }
    this.profesionesListInteres = this.scope.userLogged.intereses;
    if(!this.profesionesListInteres || this.profesionesListInteres.length==0){
      this.profesionesListInteres = [];
    }
}

segundoStep(){
  this.userToEdit.nombre = this.secondFormGroup.get('nombre').value;
  this.userToEdit.apellido = this.secondFormGroup.get('apellido').value;
  this.userToEdit.sexo = this.secondFormGroup.get('sexo').value;
  this.userToEdit.fechaNacimiento = this.secondFormGroup.get('fechaNacimiento').value;
}

tercerStep(){
  this.userToEdit.pais = this.selectedCountry 
  this.userToEdit.estadoCiudad = this.ciudad;
  this.userToEdit.telefono = this.thirdFormGroup.get('telefono').value;
}

cuartoStep(){
  this.userToEdit.profesiones = this.profesionesList;
  this.userToEdit.intereses = this.profesionesListInteres;
}

guardarCambios(){
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/' +"avatar-"+currentPictureId+ '.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('pictures/' +"avatar-"+currentPictureId+ '.jpg').getDownloadURL();
        
        this.picture.subscribe((avatarURL) => {
            this.userToEdit.avatar = avatarURL;
            this.userToEdit.notificar = false;
            this.userService.editarUsuario(this.userToEdit).then(() => {
            }).catch((error) => {
              alert('Hubo un error' + error);
              console.log(error);
            });

          });
        });
    }else{
      this.userService.editarUsuario(this.userToEdit).then(() => {
      }).catch((error) => {
        alert('Hubo un error' + error);
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
  this.country.allCountries().subscribe( data2 => {
      this.countryInfo=data2.Countries;
    },
    err => console.log(err),
    () => console.log('complete')
  )
}

onChangeCountry(countryValue) {
  this.selectedCountry = this.countryInfo[countryValue].CountryName;
  this.stateInfo=this.countryInfo[countryValue].States;
  this.cityInfo=this.stateInfo[0].Cities;
  console.log(this.cityInfo);
}

onChangeState(stateValue) {
  this.ciudad=stateValue;
}


}
