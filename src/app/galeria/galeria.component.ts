import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { User } from '../interfaces/user';
import { CrearAlbumComponent } from '../modales/crear-album/crear-album.component';
import { Album } from '../interfaces/album';
import { AngularFireStorage } from 'angularfire2/storage';
import { EditarAlbumComponent } from '../modales/editar-album/editar-album.component';
import { AlbumService } from '../services/album.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {

  userLogged: User;
  album: Album;
  albums: Album[] = [];
  

  constructor(private usuarioService: UsuarioService,
              private authenticationService: AuthenticationService,
              private dialogService: DialogService,
              private albumService: AlbumService,
              private firebaseStorage: AngularFireStorage) {

    this.authenticationService.getStatus().subscribe((status) => {

      if (status) {
        this.usuarioService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
          this.userLogged = data;
          if (this.userLogged) {
            this.albumService.getAlbumsPorEmail(this.userLogged.email).valueChanges().subscribe((data: Album[]) => {
              this.albums = data;
            });
          }
        });
      }
      
    });
  }

  editarAlbum(alb: Album) {
    this.album = alb;
    this.dialogService.addDialog(EditarAlbumComponent, { scope: this, currentRequest: alb });
  }

  crearAlbum() {
    if (this.userLogged) {

      this.dialogService.addDialog(CrearAlbumComponent, { scope: this, currentRequest: this.userLogged });
    }
  }

  eliminarAlbum(alb: Album) {

    if (alb.fotoPortada) {
      if (alb.fotoPortada.slice(0, 3) != "ass") {
        var desertRef = this.firebaseStorage.storage.refFromURL(alb.fotoPortada)
        desertRef.delete().then(function () {
        }).catch(function (error) {
          alert('Hubo un error' + error);
        });
      }
    }

    if (alb.galeriaFotos) {
      for (let i = 0; i < alb.galeriaFotos.length; i++) {
        var desertRef = this.firebaseStorage.storage.refFromURL(alb.galeriaFotos[i])
        desertRef.delete().then(function () {
        }).catch(function (error) {
          alert('Hubo un error' + error);
        });
      }
    }
    
    this.albums = this.albums.filter(obj => obj !== alb);
    this.albumService.editAlbum(this.userLogged.email, this.albums).then(() => {
    }).catch((error) => {
      alert('Hubo un error el eliminar' + error);
    });

  }

  ngOnInit() {
  }

}
