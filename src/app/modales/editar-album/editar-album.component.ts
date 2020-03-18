import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { UsuarioService } from '../../services/usuario.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Album } from 'src/app/interfaces/album';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AlbumService } from 'src/app/services/album.service';

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
  selector: 'app-editar-album',
  templateUrl: './editar-album.component.html',
  styleUrls: ['./editar-album.component.css'],
  providers: [DatePipe, { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } }]
})

export class EditarAlbumComponent extends DialogComponent<PromptModel, any> implements PromptModel {

  scope: any;
  currentRequest: any;

  userSolicitud: User;
  userLogged: User;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  user: User;

  fotoPortada: any = '';
  //userToEdit: User;
  galeriaFotos: any[] = [];
  albumToEdit: Album;
  mensajeError: string;
  mensajeExito: string;

  fotosUpload: FotosAlbum[] = [];

  tablaUpload: FotosAlbum;

  modificadaPortada: boolean = false;
  modificadaGaleriaFotos: boolean = false;

  albums: Album[];

  constructor(public dialogService: DialogService,
    private userService: UsuarioService,
    private albumService: AlbumService,
    private _formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage) {
    super(dialogService);

  }

  ngOnInit() {

    this.albumToEdit = this.currentRequest;
    this.fotoPortada = this.albumToEdit.fotoPortada;

    if (!this.albumToEdit.galeriaFotos || this.albumToEdit.galeriaFotos.length == 0) {
      this.albumToEdit.galeriaFotos = [];
    }
    for (let i = 0; i < this.albumToEdit.galeriaFotos.length; i++) {
      let alb: FotosAlbum = { file: this.albumToEdit.galeriaFotos[i], nombre: this.albumToEdit.galeriaFotos[i], nombreCol: "archivo - " + (i + 1) };
      this.fotosUpload.push(alb);
    }
    this.firstFormGroup = this._formBuilder.group({
      titulo: [this.albumToEdit.titulo,],
      fotoPortada: [],
      subtitulo: [this.albumToEdit.subtitulo,],
      fechaCreacion: ['',],
    });
    this.secondFormGroup = this._formBuilder.group({
      fotosUpload: [],
    });
    this.thirdFormGroup = this._formBuilder.group({
      contenido: [this.albumToEdit.contenido,],
      autor: [this.albumToEdit.autor,]
    });
    if (this.scope.userLogged) {
      this.userLogged = this.scope.userLogged;

    }
  }

  eliminarFoto(event) {
    if (this.albumToEdit.galeriaFotos.length > 1) {
      this.scope.albums = this.scope.albums.filter(obj => obj.uid !== this.scope.album.uid);
      this.albumToEdit.galeriaFotos = this.albumToEdit.galeriaFotos.filter(obj => obj !== event.nombre);
      var desertRef = this.firebaseStorage.storage.refFromURL(event.nombre);
      desertRef.delete().then(function () {
        this.mensajeExito = "elemento eliminado ok"
      }).catch(function (error) {
      });
      this.mensajeError = ""
      this.fotosUpload = this.fotosUpload.filter(obj => obj !== event);
      this.scope.albums.push(this.albumToEdit);
      this.albumService.editAlbum(this.userLogged.email, this.scope.albums).then(() => {
      }).catch((error) => {
        alert('Hubo un error al persistir con cambio de imagen' + error);
      });
    } else {
      this.mensajeError = "al menos debe haber un archivo en el album."
    }
  }

  public cambioArchivo(event) {

    if ((this.fotosUpload.length + event.target.files.length) > 0 && (this.fotosUpload.length + event.target.files.length) < 5) {
      for (let i = 0; i < event.target.files.length; i++) {
        
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
              this.scope.albums = this.scope.albums.filter(obj => obj.uid !== this.scope.album.uid);
              this.albumToEdit.galeriaFotos.push(avatarURL);
              this.tablaUpload = { file: '', nombre: '', nombreCol: '', };
              this.tablaUpload.nombre = avatarURL;
              var fileExt = fileA.name.split('.').pop();
              this.tablaUpload.nombreCol = "archivo - " + (i + 1) + "." + fileExt;
              this.fotosUpload.push(this.tablaUpload);

              this.scope.albums.push(this.albumToEdit);
              this.albumService.editAlbum(this.userLogged.email, this.scope.albums).then(() => {
              }).catch((error) => {
                alert('Hubo un error al persistir con cambio de imagen' + error);
              });

            });

          });

        };

      }
      

    } else {
      this.mensajeError = "Debe seleccionar al menos 1 archivo y como maximo 4."
    }
  }

  confirmDatosPortada() {

    this.scope.albums = this.scope.albums.filter(obj => obj.uid !== this.scope.album.uid);
    let alb: Album = this.albumToEdit;
    alb.titulo = this.firstFormGroup.get('titulo').value;
    alb.subtitulo = this.firstFormGroup.get('subtitulo').value;

    //boorrar imagen si es que se ha modificado
    if (this.croppedImage) {
      if (alb.fotoPortada) {
        var desertRef = this.firebaseStorage.storage.refFromURL(alb.fotoPortada);
        desertRef.delete().then(function () {
        }).catch(function (error) {
          alert('Hubo un error' + error);
        });
      }
      //persistir nueva img en la store y generar ULR para luego persistir usuario
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('portada/' + "portada-" + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('portada/' + "portada-" + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((avatarURL) => {
          alb.fotoPortada = avatarURL;
          this.fotoPortada = avatarURL;
          //persistir album
          this.scope.albums.push(alb)
          this.albumService.editAlbum(this.userLogged.email, this.scope.albums).then(() => {

          }).catch((error) => {
            alert('Hubo un error al persistir con cambio de imagen' + error);
          });

        })
      })
    } else {
      //persistir album solo sin cambio de imagen
      this.scope.albums.push(alb)
      this.albumService.editAlbum(this.userLogged.email, this.scope.albums).then(() => {
      }).catch((error) => {
        alert('Hubo un error al persistir sin cambio de imagen' + error);
      });
    }
  }

  confirmDatosContenido() {

    
    let alb: Album = this.albumToEdit;
   // this.albums.filter(x => x.uid === this.albumToEdit.uid);

    alb.contenido = this.thirdFormGroup.get('contenido').value;
    alb.autor = this.thirdFormGroup.get('autor').value;
    this.scope.albums = this.scope.albums.filter(obj => obj.uid !== this.scope.album.uid);

    this.scope.albums.push(alb);
    this.albumService.editAlbum(this.userLogged.email, this.scope.albums).then(() => {
      this.mensajeExito = "cambios realizados ok"
    }).catch((error) => {
      alert('Hubo un error al persistir contenido' + error);
    });

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.modificadaPortada = true;
  }

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

}