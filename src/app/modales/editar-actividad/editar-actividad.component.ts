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
  selector: 'app-editar-actividad',
  templateUrl: './editar-actividad.component.html',
  styleUrls: ['./editar-actividad.component.css'],
  providers: [DatePipe, { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }]
})

export class EditarActividadComponent extends DialogComponent<PromptModel, any> implements PromptModel {
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

  actividadToEdit: Actividad;

  imageChangedEvent: any = '';
  picture: any;
  user: User;
  selectedCountry: string;

  fotoPortada: any = '';
  huboCambioDeImagen: boolean;

  todasLasProfesiones: string[] = ['Meditacion', 'Moda', 'Eventos', 'Educacion', 'Musica', 'Arte', 'Ingeniero'];

  horas: Tabla[] = [
    { value: '00', viewValue: '00 hrs' },
    { value: '01', viewValue: '01 hrs' },
    { value: '02', viewValue: '02 hrs' },
    { value: '03', viewValue: '03 hrs' },
    { value: '04', viewValue: '04 hrs' },
    { value: '05', viewValue: '05 hrs' },
    { value: '06', viewValue: '06 hrs' },
    { value: '07', viewValue: '07 hrs' },
    { value: '08', viewValue: '08 hrs' },
    { value: '09', viewValue: '09 hrs' },
    { value: '10', viewValue: '10 hrs' },
    { value: '11', viewValue: '11 hrs' },
    { value: '12', viewValue: '12 hrs' },
    { value: '13', viewValue: '13 hrs' },
    { value: '14', viewValue: '14 hrs' },
    { value: '15', viewValue: '15 hrs' },
    { value: '16', viewValue: '16 hrs' },
    { value: '17', viewValue: '17 hrs' },
    { value: '18', viewValue: '18 hrs' },
    { value: '19', viewValue: '19 hrs' },
    { value: '20', viewValue: '20 hrs' },
    { value: '21', viewValue: '21 hrs' },
    { value: '22', viewValue: '22 hrs' },
    { value: '23', viewValue: '23 hrs' },
    { value: '24', viewValue: '24 hrs' },

  ];

  minutos: Tabla[] = [
    { value: '00', viewValue: '00 min' },
    { value: '15', viewValue: '15 min' },
    { value: '30', viewValue: '30 min' },
    { value: '45', viewValue: '45 min' },
  ];


  @ViewChild('profesionesInput', { static: false }) profesionesInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocompleteProfesion: MatAutocomplete;


  constructor(public dialogService: DialogService,
    private userService: UsuarioService,
    private country: CountriesService,
    private _formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private actividadService: ActividadService) {
    super(dialogService);

    this.filteredProfesiones = this.profesionCtrl.valueChanges.pipe(
      startWith(null),
      map((prof: string | null) => prof ? this._filter(prof) : this.todasLasProfesiones.slice()));

  }

  formatDateInicio(e) {
    var d = new Date(e.target.value);
    var fecha = new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaInicio').setValue(fecha);
  }

  formatDateFin(e) {
    var d = new Date(e.target.value);
    var fecha = new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaFin').setValue(fecha);
  }

  ngOnInit() {
    this.getCountries();

    this.actividadToEdit = this.currentRequest;
    this.fotoPortada = this.actividadToEdit.fotoPortada;

    this.profesionesList = this.actividadToEdit.profesionesRelacionadas;
    if (!this.profesionesList) {
      this.profesionesList = [];
    }

    this.firstFormGroup = this._formBuilder.group({
      titulo: [this.actividadToEdit.titulo, Validators.required],
      avatar: [],
    });
    this.secondFormGroup = this._formBuilder.group({
      fechaInicio: [this.actividadToEdit.fechaInicio, Validators.required],
      fechaFin: [this.actividadToEdit.fechaFin, Validators.required],
      horaInicioA: [this.actividadToEdit.horaInicio, Validators.required],
      horaInicioB: [this.actividadToEdit.horaInicio, Validators.required],
      horaFinA: [this.actividadToEdit.horaFin, Validators.required],
      horaFinB: [this.actividadToEdit.horaFin, Validators.required],
      pais: [this.actividadToEdit.pais, Validators.required],
      estadoCiudad: [this.actividadToEdit.estadoCiudad, Validators.required],
      direccion: [this.actividadToEdit.direccion, Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      profesionesRelacionadas: [this.actividadToEdit.profesionesRelacionadas,],
      informacion: [this.actividadToEdit.informacion, Validators.required],
    });
    if (this.scope.userLogged) {
      this.userLogged = this.scope.userLogged;
    }
  }

  selectionChange($event?: StepperSelectionEvent) {
    if ($event.selectedIndex === 1 || $event.selectedIndex === 2) {
      this.primerStep();
    } else if ($event.selectedIndex === 0 || $event.selectedIndex === 2) {
      this.segundoStep();
    }
  }

  primerStep() {
    this.actividadToEdit.titulo = this.firstFormGroup.get('titulo').value;
  }

  segundoStep() {
    this.actividadToEdit.fechaInicio = this.secondFormGroup.get('fechaInicio').value;
    this.actividadToEdit.fechaFin = this.secondFormGroup.get('fechaFin').value;
    this.actividadToEdit.direccion = this.secondFormGroup.get('direccion').value;
  }

  guardarCambios() {

    this.actividadToEdit.informacion = this.thirdFormGroup.get('informacion').value;
    this.actividadToEdit.profesionesRelacionadas = this.profesionesList;

    if (this.huboCambioDeImagen) {
      const currentPictureId = Date.now();
      if (this.actividadToEdit.fotoPortada) {
        var desertRef = this.firebaseStorage.storage.refFromURL(this.actividadToEdit.fotoPortada)
        desertRef.delete().then(function () {
        }).catch(function (error) {
          alert('Hubo un error al eliminar foto' + error);
        });
      }
      const pictures = this.firebaseStorage.ref('actividades/' + "act-" + currentPictureId + '.jpg').putString(this.fotoPortada, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('actividades/' + "act-" + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((avatarURL) => {
          this.actividadToEdit.fotoPortada = avatarURL;
          this.scope.actividades = this.scope.actividades.filter(obj => obj.uid !== this.scope.actividad.uid);
          this.scope.actividades.push(this.actividadToEdit);
          this.actividadService.editActividad(this.userLogged.email, this.scope.actividades).then(() => {
            this.scope.actividades.sort((a: Actividad, b: Actividad) => +new Date(b.fechaCreacion) - +new Date(a.fechaCreacion));

          }).catch((error) => {
            alert('Hubo un error al persistir' + error);
            console.log(error);
          });
        });
      });
    } else {
      this.scope.actividades = this.scope.actividades.filter(obj => obj.uid !== this.scope.actividad.uid);
      this.scope.actividades.push(this.actividadToEdit);
      this.actividadService.editActividad(this.userLogged.email, this.scope.actividades).then(() => {
      
      this.scope.actividades.sort((a: Actividad, b: Actividad) => +new Date(b.fechaCreacion) - +new Date(a.fechaCreacion));

      }).catch((error) => {
        alert('Hubo un error al persistir' + error);
        console.log(error);
      });
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.fotoPortada = event.base64;
    this.huboCambioDeImagen = true;
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

  getCountries() {
    this.country.allCountries().subscribe(data2 => {
      this.countryInfo = data2.Countries;
    },
      err => console.log(err),
      () => console.log('complete')
    )
  }

  onChangeCountry(countryValue) {
    this.selectedCountry = this.countryInfo[countryValue].CountryName;
    this.stateInfo = this.countryInfo[countryValue].States;
    this.cityInfo = this.stateInfo[0].Cities;
    this.actividadToEdit.pais = this.selectedCountry;
    this.actividadToEdit.estadoCiudad = '';
  }

  onChangeState(stateValue) {
    this.ciudad = stateValue;
    this.actividadToEdit.estadoCiudad = stateValue;

  }

  onChangeHoraInicio(event): void {
    this.secondFormGroup.get('horaInicioA').setValue(event);
    let minutos = this.actividadToEdit.horaInicio.substring(2, 5);
    this.actividadToEdit.horaInicio = event + minutos;
  }

  onChangeMinutosInicio(event): void {
    this.secondFormGroup.get('horaInicioB').setValue(event);
    let hora = this.actividadToEdit.horaInicio.substring(0, 2);
    this.actividadToEdit.horaInicio = hora + event;
  }

  onChangeHoraFin(event): void {
    this.secondFormGroup.get('horaFinA').setValue(event);
    let minutos = this.actividadToEdit.horaFin.substring(2, 5);
    this.actividadToEdit.horaFin = event + minutos;
  }

  onChangeMinutosFin(event): void {
    this.secondFormGroup.get('horaFinB').setValue(event);
    let hora = this.actividadToEdit.horaFin.substring(0, 2);
    this.actividadToEdit.horaFin = hora + event;
  }

}
