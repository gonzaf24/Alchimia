import { Component, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { UsuarioService } from '../../services/usuario.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CountriesService } from 'src/app/services/countries.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DatePipe } from '@angular/common';
import { Actividad } from 'src/app/interfaces/actividad';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividades } from 'src/app/interfaces/actividades';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}
export interface Pais {
  value: string;
  viewValue: string;
}
export interface Ciudad {
  value: string;
  viewValue: string;
}

export interface Tabla {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css'],
  providers: [DatePipe,{ provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}]
})

export class CrearActividadComponent extends DialogComponent<PromptModel, any> implements PromptModel {
  scope: any;
  currentRequest: any;
  userSolicitud: User;

  query: string = '';
  userLogged: User;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  
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
  
  actividadToCreate: Actividad;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  user: User;
  selectedCountry: string;

  actividades: Actividad[] = [];

  todasLasProfesiones: string[] = [ 'Meditacion', 'Moda', 'Eventos', 'Educacion','Musica', 'Arte' ,'Ingeniero'];

  horas: Tabla[] = [
    {value: '00', viewValue: '00 hrs'},
    {value: '01', viewValue: '01 hrs'},
    {value: '02', viewValue: '02 hrs'},
    {value: '03', viewValue: '03 hrs'},
    {value: '04', viewValue: '04 hrs'},
    {value: '05', viewValue: '05 hrs'},
    {value: '06', viewValue: '06 hrs'},
    {value: '07', viewValue: '07 hrs'},
    {value: '08', viewValue: '08 hrs'},
    {value: '09', viewValue: '09 hrs'},
    {value: '10', viewValue: '10 hrs'},
    {value: '11', viewValue: '11 hrs'},
    {value: '12', viewValue: '12 hrs'},
    {value: '13', viewValue: '13 hrs'},
    {value: '14', viewValue: '14 hrs'},
    {value: '15', viewValue: '15 hrs'},
    {value: '16', viewValue: '16 hrs'},
    {value: '17', viewValue: '17 hrs'},
    {value: '18', viewValue: '18 hrs'},
    {value: '19', viewValue: '19 hrs'},
    {value: '20', viewValue: '20 hrs'},
    {value: '21', viewValue: '21 hrs'},
    {value: '22', viewValue: '22 hrs'},
    {value: '23', viewValue: '23 hrs'},
    {value: '24', viewValue: '24 hrs'},

  ];

  minutos: Tabla[] = [
    {value: '00', viewValue: '00 min'},
    {value: '15', viewValue: '15 min'},
    {value: '30', viewValue: '30 min'},
    {value: '45', viewValue: '45 min'},
  ];


  @ViewChild('profesionesInput',{ static: false }) profesionesInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto',{ static: false }) matAutocompleteProfesion: MatAutocomplete;

constructor(public dialogService: DialogService, 
              private userService: UsuarioService,
              private country: CountriesService,
              private _formBuilder: FormBuilder,
              private actividadService: ActividadService, 
              private firebaseStorage: AngularFireStorage) {
    super(dialogService);

    this.filteredProfesiones = this.profesionCtrl.valueChanges.pipe(
      startWith(null),
      map((prof: string | null) => prof ? this._filter(prof) : this.todasLasProfesiones.slice()));

}

selectionChange($event?: StepperSelectionEvent){
  if($event.selectedIndex===1 || $event.selectedIndex===2){
   this.primerStep();
  }else if($event.selectedIndex===0 || $event.selectedIndex===2){
   this.segundoStep();
  }
}

ngOnInit(){
  this.getCountries();
  this.actividadToCreate = {};
  this.firstFormGroup = this._formBuilder.group({
    titulo: ['', Validators.required],
    avatar:[],
    fechaCreacion:[''],
  });
  this.secondFormGroup = this._formBuilder.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    horaInicioA: ['', Validators.required],
    horaInicioB: ['', Validators.required],
    horaFinA: ['', Validators.required],
    horaFinB: ['', Validators.required],
    pais: ['', Validators.required],
    estadoCiudad: ['', Validators.required],
    direccion: ['',Validators.required]
  });
  this.thirdFormGroup = this._formBuilder.group({
    profesionesRelacionadas:[[],],
    informacion: ['', Validators.required],
  });
  this.userService.getUserById(this.currentRequest.uid).valueChanges().subscribe( (data: User) => {
    this.userLogged = data;
    this.actividadService.getActividadesPorEmail(this.userLogged.email).valueChanges().subscribe((data1: Actividad[]) => {
      this.actividades = data1;
    });
  });
}


formatDateInicio(e) {
    var d = new Date(e.target.value); 
    var fecha =new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaInicio').setValue(fecha);
}

formatDateFin(e) {
    var d = new Date(e.target.value); 
    var fecha =new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaFin').setValue(fecha);
}

primerStep(){
  this.actividadToCreate.titulo = this.firstFormGroup.get('titulo').value;
}

segundoStep(){
  this.actividadToCreate.fechaInicio = this.secondFormGroup.get('fechaInicio').value;
  this.actividadToCreate.fechaFin = this.secondFormGroup.get('fechaFin').value;
  this.actividadToCreate.horaInicio = (this.secondFormGroup.get('horaInicioA').value+this.secondFormGroup.get('horaInicioB').value);
  this.actividadToCreate.horaFin = (this.secondFormGroup.get('horaFinA').value+this.secondFormGroup.get('horaFinB').value);
  this.actividadToCreate.pais = this.selectedCountry
  this.actividadToCreate.estadoCiudad = this.ciudad;
  this.actividadToCreate.direccion = this.secondFormGroup.get('direccion').value;
}

guardarCambios(){

  this.actividadToCreate.informacion = this.thirdFormGroup.get('informacion').value;
  this.actividadToCreate.profesionesRelacionadas = this.profesionesList;
  
  
  var d = new Date(Date.now()); 
  var fecha =new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
  this.firstFormGroup.get('fechaCreacion').setValue(fecha);
  this.actividadToCreate.fechaCreacion = this.firstFormGroup.get('fechaCreacion').value; 

  const ids = [this.userLogged.uid, Date.now()].sort();
  this.actividadToCreate.uid  = ids.join('|');
  let actividades: Actividades= {actividades:[]};
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('actividades/' +"act-"+currentPictureId+ '.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('actividades/' +"act-"+currentPictureId+ '.jpg').getDownloadURL();
        this.picture.subscribe((avatarURL) => {
            this.actividadToCreate.fotoPortada = avatarURL;
            this.actividades.push(this.actividadToCreate)
            actividades.actividades=this.actividades;
            this.actividadService.newActividad(this.userLogged.email,actividades).then(() => {
              this.scope.actividades.sort((a: Actividad, b: Actividad) => +new Date(b.fechaCreacion) - +new Date(a.fechaCreacion));

            }).catch((error) => {
              alert('Hubo un error' + error);
            });
        });
      });
    }else{
      this.actividades.push(this.actividadToCreate)
      actividades.actividades=this.actividades;
      this.actividadService.newActividad(this.userLogged.email,actividades).then(() => {
        this.scope.actividades.sort((a: Actividad, b: Actividad) => +new Date(b.fechaCreacion) - +new Date(a.fechaCreacion));

      }).catch((error) => {
        alert('Hubo un error' + error);
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
    this.thirdFormGroup.updateValueAndValidity();
  }
  // Reset the input value
  if (input) {
    input.value = '';
  }
  this.profesionCtrl.setValue(null);
}

removeProf(prof: string): void {
  const index = this.profesionesList.indexOf(prof);
  if (index >= 0) {
    this.profesionesList.splice(index, 1);
  }
}

selectedProf(event: MatAutocompleteSelectedEvent): void {
  this.profesionesList.push(event.option.viewValue);
  this.profesionesInput.nativeElement.value = '';
  this.profesionCtrl.setValue(null);
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

onChangeHoraInicio(event): void {
  this.secondFormGroup.get('horaInicioA').setValue(event);
}

onChangeMinutosInicio(event): void {
  this.secondFormGroup.get('horaInicioB').setValue(event);
}

onChangeHoraFin(event): void {
  this.secondFormGroup.get('horaFinA').setValue(event);
}

onChangeMinutosFin(event): void {
  this.secondFormGroup.get('horaFinB').setValue(event);
}

}
