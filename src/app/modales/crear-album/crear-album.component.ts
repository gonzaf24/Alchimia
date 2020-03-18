import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { UsuarioService } from '../../services/usuario.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Album } from 'src/app/interfaces/album';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { AlbumService } from 'src/app/services/album.service';
import { Albums } from 'src/app/interfaces/albums';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}

export interface FotosAlbum {
  nombre: string;
  nombreCol: string;
  file: any;
}

@Component({
  selector: 'app-crear-album',
  templateUrl: './crear-album.component.html',
  styleUrls: ['./crear-album.component.css'],
  providers: [DatePipe, { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }]
})


export class CrearAlbumComponent extends DialogComponent<PromptModel, any> implements PromptModel {

  scope: any;
  currentRequest: any;
  userSolicitud: User;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  user: User;

  fotoPortada: any = '';
  userLogged: User;
  galeriaFotos: any[] = [];
  albunToCreate: Album;
  mensajeError: string;

  fotosUpload: FotosAlbum[] = [];

  tablaUpload: FotosAlbum;

  albums: Album[]= [];
  
  constructor(public dialogService: DialogService,
    private userService: UsuarioService,
    private albumService: AlbumService,
    private _formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage) {
    super(dialogService);

  }

  selectionChange($event?: StepperSelectionEvent){
    if($event.selectedIndex===1 || $event.selectedIndex===2){
     this.primerStep();
    }else if($event.selectedIndex===0 || $event.selectedIndex===2){
     this.segundoStep();
    }
  }

  ngOnInit() {

    this.albunToCreate = { uid: '', galeriaFotos: [] };
    this.firstFormGroup = this._formBuilder.group({
      titulo: ['',],
      fotoPortada: ['',],
      subtitulo: ['',],
      fechaCreacion: ['',],
    });
    this.secondFormGroup = this._formBuilder.group({
      fotosUpload: [[],],
    });
    this.thirdFormGroup = this._formBuilder.group({
      contenido: ['', Validators.required],
      autor: ['', Validators.required]
    });
    this.userService.getUserById(this.currentRequest.uid).valueChanges().subscribe((data: User) => {
      this.userLogged = data;
      this.albumService.getAlbumsPorEmail(this.userLogged.email).valueChanges().subscribe((data: Album[]) => {
        this.albums = data;
      });
    });

  }

  eliminarFoto(event) {
    this.albunToCreate.galeriaFotos = this.albunToCreate.galeriaFotos.filter(obj => obj !== event.nombre);
    var desertRef = this.firebaseStorage.storage.refFromURL(event.nombre)
    desertRef.delete().then(function () {
    }).catch(function (error) {
    });

    this.mensajeError = ""
    this.fotosUpload = this.fotosUpload.filter(obj => obj !== event);
    if (this.fotosUpload.length == 0) {
      this.fotosUpload = [];
      this.secondFormGroup.get('fotosUpload').setValue([]);
    }
    
  }

  public cambioArchivo(event) {

    if ((this.fotosUpload.length + event.target.files.length) > 0 && (this.fotosUpload.length + event.target.files.length) < 5) {

      for (let i = 0; i < event.target.files.length; i++) {
        //agrego la carga de archivos a la persistencia de galeriaFotos     
        this.tablaUpload = { file: '', nombre: '', nombreCol: '', };
        const fileA = event.target.files[i];
        const reader = new FileReader();
        reader.readAsDataURL(fileA);
        reader.onload = () => {
          this.tablaUpload.file = reader.result;
          const currentPictureId = Date.now();
          const pictures = this.firebaseStorage.ref('album/' + "album-" + currentPictureId + '.jpg').putString(this.tablaUpload.file, 'data_url');
          pictures.then((result) => {
            this.picture = this.firebaseStorage.ref('album/' + "album-" + currentPictureId + '.jpg').getDownloadURL();
            this.picture.subscribe((avatarURL) => {
              this.albunToCreate.galeriaFotos.push(avatarURL);
              this.tablaUpload = { file: '', nombre: '', nombreCol: '', };
              this.tablaUpload.nombre = avatarURL;
              var fileExt = fileA.name.split('.').pop();
              this.tablaUpload.nombreCol = "archivo - " + (i + 1) + "." + fileExt;
              this.fotosUpload.push(this.tablaUpload);
            });
          });
        };
      }

    } else {
      this.mensajeError = "Debe seleccionar al menos 1 archivo y como maximo 4."
    }
  }

  primerStep() {
    this.albunToCreate.titulo = this.firstFormGroup.get('titulo').value;
    this.albunToCreate.subtitulo = this.firstFormGroup.get('subtitulo').value;
  }

  segundoStep() {
    //this.albunToCreate.galeriaFotos = this.secondFormGroup.get('fotosUpload').value;
  }

  guardarCambios() {
    this.albunToCreate.contenido = this.thirdFormGroup.get('contenido').value;
    this.albunToCreate.autor = this.thirdFormGroup.get('autor').value;

    const ids = [this.userLogged.uid, Date.now()].sort();
    this.albunToCreate.uid = ids.join('|');

    var d = new Date(Date.now());
    var fecha = new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.firstFormGroup.get('fechaCreacion').setValue(fecha);
    this.albunToCreate.fechaCreacion = this.firstFormGroup.get('fechaCreacion').value;
    let albums: Albums={albums:[]};
    if (this.fotoPortada) {

      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('portada/' + "portada-" + currentPictureId + '.jpg').putString(this.fotoPortada, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('portada/' + "portada-" + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((avatarURL) => {

          this.albunToCreate.fotoPortada = avatarURL;
          this.albums.push(this.albunToCreate);
          albums.albums=this.albums; 
          this.albumService.newAlbum(this.userLogged.email, albums).then(() => {

          }).catch((error) => {
            alert('Hubo un error' + error);
            console.log(error);
          });

        });
      });
    } else {
      this.albums.push(this.albunToCreate);
      albums.albums=this.albums; 
      this.albumService.newAlbum(this.userLogged.email, albums).then(() => {

      }).catch((error) => {
        alert('Hubo un error' + error);
        console.log(error);
      });

    }

  }

  cerrar() {
    if (this.albunToCreate.galeriaFotos) {
      for (let i = 0; i < this.albunToCreate.galeriaFotos.length; i++) {
        var desertRef = this.firebaseStorage.storage.refFromURL(this.albunToCreate.galeriaFotos[i])
        desertRef.delete().then(function () {
        }).catch(function (error) {
        });
      }
    }

  }

  formatDate(e) {
    var d = new Date(e.target.value);
    var fecha = new Date(d.toISOString().replace("Z", "-02:00")).toISOString().replace(".000", "");
    this.secondFormGroup.get('fechaNacimiento').setValue(fecha);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.fotoPortada = event.base64;
  }
  imageLoaded() {
  }
  cropperReady() {
  }
  loadImageFailed() {
  }

}



