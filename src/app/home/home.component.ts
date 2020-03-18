import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { CrearUsuarioComponent } from '../modales/crear-usuario/crear-usuario.component';
import { Actividad } from '../interfaces/actividad';
import { Album } from '../interfaces/album';
import { ActividadService } from '../services/actividad.service';
import { AlbumService } from '../services/album.service';
import { Albums } from '../interfaces/albums';
import { Actividades } from '../interfaces/actividades';

export interface Muro {
  tipo: string;
  fecha: Date;
  actividad: Actividad;
  usuario: User;
  album: Album,
  aboutTime: string;
  autor: string;
  email: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  userLogged: User;
  unaSolaVez: boolean = false;

  muro: Muro[] = [];

  constructor(private usuarioService: UsuarioService,
    private actividadService: ActividadService,
    private albumService: AlbumService,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService) {

    this.authenticationService.getStatus().subscribe((status) => {
      if (status) {
        this.usuarioService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
          this.userLogged = data;

        }, (error) => {
          console.log(error);
        });
      }
    }, (error) => {
      console.log(error);
    });
    if (this.authenticationService.currentUserValue()) {
      this.usuarioService.getUserById(this.authenticationService.currentUserValue().uid).valueChanges().subscribe((data: User) => {
        this.userLogged = data;
        if (this.userLogged && this.userLogged.notificar && !this.unaSolaVez) {
          this.unaSolaVez = true;
          this.dialogService.addDialog(CrearUsuarioComponent, { scope: this, currentRequest: this.userLogged });
        }
      });
    }

    this.obtenerMuro();

  }

  async obtenerMuro(){

    let startDate = new Date();
    let fechaHoy = new Date();
    let fechaHoyMenosTresMeses: any;
    let fechaHoyFormato: any;
    startDate.setMonth(startDate.getMonth() - 4);
    fechaHoyMenosTresMeses = startDate.toISOString().slice(0, 10);
    fechaHoyFormato = fechaHoy.toISOString().slice(0, 10);
    let usuariosParaIterar: User[];

    //Obtengo todos los usuarios || ya se que no es performante para nada , habria que ponerle 
    // filtros de fecha a las consultas de Usuarios, Actividades, Album, asi como todo lo que se quiera 
    // mostrar en el muro (wall)   --->    :(

    this.usuarioService.getUserToWall().valueChanges().subscribe((data: User[]) => {
      usuariosParaIterar = data;
      for (let i = 0; i < usuariosParaIterar.length; i++) {
        let usuarioA = usuariosParaIterar[i];
        let fc = new Date(usuarioA.fechaCreacion);
        let fechaCreacionUser: any;
        fechaCreacionUser = fc.toISOString().slice(0, 10)
        if (fechaCreacionUser > fechaHoyMenosTresMeses) {
          let aboutTimes: string = "";
          if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) === 0 || this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) < 0) {
            aboutTimes = "hoy ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) === 1) {
            aboutTimes = "hace 1 dia ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) === 2) {
            aboutTimes = "hace 2 dias ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) === 3) {
            aboutTimes = "hace 3 dias ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) === 4) {
            aboutTimes = "hace 3 dias ... ";
          } else if ((this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) >= 5 )&& (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) <= 10)) {
            aboutTimes = "+ de 5 dias ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) >= 11 && this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) <= 20) {
            aboutTimes = "+ de 10 dias ... ";
          } else if (this.funcionDeFechas(fechaCreacionUser, fechaHoyFormato) >= 30) {
            aboutTimes = "+ de 1 mes ... ";
          }
          let muroAdd: Muro = {
            tipo: "user",
            fecha: fechaCreacionUser,
            actividad: null,
            usuario: usuarioA,
            album: null,
            aboutTime: aboutTimes,
            autor: usuarioA.nombre + " " + usuarioA.apellido,
            email: usuarioA.email
          };

          this.muro.push(muroAdd);
          this.ordenar();

        }
      }
    }, (error) => {
      alert("errror" + error);
    });

    this.albumService.getAlbumsToWall().valueChanges().subscribe((data: any[]) => {
      // obtengo la lista del ...@...,com
      let albumWall: any[] = data;
      
      for (let h = 0; h < albumWall.length; h++) {

        let albms: Albums = albumWall[h];
        //recorro los albums de ese usuario
        for(let i = 0 ; i <albms.albums.length ; i++ ){
          
          let alb : Album =  albms.albums[i];

          let idUser = alb.uid.substring(alb.uid.indexOf("|") + 1);

          let fcA = new Date(alb.fechaCreacion);
          let fechaCreacionAlbum: any;
          fechaCreacionAlbum = fcA.toISOString().slice(0, 10)

          if (fechaCreacionAlbum > fechaHoyMenosTresMeses) {
  
              let aboutTimesA: string = "";
  
              if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) === 0 || this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) < 0) {
                aboutTimesA = "hoy ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) === 1) {
                aboutTimesA = "hace 1 dia ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) === 2) {
                aboutTimesA = "hace 2 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) === 3) {
                aboutTimesA = "hace 3 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) === 4) {
                aboutTimesA = "hace 3 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) >= 5 && this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) <= 10) {
                aboutTimesA = "+ de 5 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) >= 11 && this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) <= 20) {
                aboutTimesA = "+ de 10 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionAlbum, fechaHoyFormato) >= 30) {
                aboutTimesA = "+ de 1 mes ... ";
              }

              this.usuarioService.getUserById(idUser).valueChanges().subscribe((data: User) => {
  
                  let user = data;
  
                  let muroAddA: Muro = {
                    tipo: "album",
                    fecha: fechaCreacionAlbum,
                    actividad: null,
                    usuario: null,
                    album: alb,
                    aboutTime: aboutTimesA,
                    autor: user.nombre + " " + user.apellido,
                    email: user.email
                  };
  
                  this.muro.push(muroAddA);
                  this.ordenar();

              }, (error) => {
                alert("errror" + error);
              });
            }
        }
      }
    }, (error) => {
      alert("errror" + error);
    });

    this.actividadService.getActividadesToWall().valueChanges().subscribe((data: any[]) => {

      // obtengo la lista del ...@...,com
      let actividadesWall: any[] = data;
      for (let i = 0; i < actividadesWall.length; i++) {
        let activi: Actividades = actividadesWall[i];
         //recorro las actividades de ese usuario
        for (let h = 0; h < activi.actividades.length; h++) {
          let acti: Actividad = activi.actividades[h];

          let idUser = acti.uid.substring(acti.uid.indexOf("|") + 1);
          
            let user = data;
            let fcA = new Date(acti.fechaCreacion);
            let fechaCreacionActiv: any;
            fechaCreacionActiv = fcA.toISOString().slice(0, 10)

            if (fechaCreacionActiv > fechaHoyMenosTresMeses) {
              let aboutTimesA: string = "";

              if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) === 0 || this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) < 0) {
                aboutTimesA = "hoy ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) === 1) {
                aboutTimesA = "hace 1 dia ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) === 2) {
                aboutTimesA = "hace 2 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) === 3) {
                aboutTimesA = "hace 3 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) === 4) {
                aboutTimesA = "hace 4 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) >= 5 && this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) <= 10) {
                aboutTimesA = "+ de 5 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) >= 11 && this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) <= 20) {
                aboutTimesA = "+ de 10 dias ... ";
              } else if (this.funcionDeFechas(fechaCreacionActiv, fechaHoyFormato) >= 30) {
                aboutTimesA = "+ de 1 mes ... ";
              }
              this.usuarioService.getUserById(idUser).valueChanges().subscribe((data: User) => {

                let user = data;

              let muroAddA: Muro = {
                tipo: "activ",
                fecha: fechaCreacionActiv,
                actividad: acti,
                usuario: null,
                album: null,
                aboutTime: aboutTimesA,
                autor: user.nombre + " " + user.apellido,
                email: user.email
              };

              this.muro.push(muroAddA);
              this.ordenar();

            }, (error) => {
              alert("errror" + error);
            });

          }

        }
      }

    }, (error) => {
      alert("errror" + error);
    });

  }

  ordenar(){
    this.muro.sort((a: Muro, b: Muro) => +new Date(b.fecha) - +new Date(a.fecha));
  }

  funcionDeFechas(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  ngOnInit() {

    if (this.authenticationService.currentUserValue()) {
      this.usuarioService.getUserById(this.authenticationService.currentUserValue().uid).valueChanges().subscribe((data: User) => {
        this.userLogged = data;
        if (this.userLogged && this.userLogged.notificar && !this.unaSolaVez) {
          this.unaSolaVez = true;
          this.dialogService.addDialog(CrearUsuarioComponent, { scope: this, currentRequest: this.userLogged });
        }
      });
    }
  }

  primeraVez() {
    if (this.userLogged && this.userLogged.notificar && !this.unaSolaVez) {
      this.unaSolaVez = true;
      this.dialogService.addDialog(CrearUsuarioComponent, { scope: this, currentRequest: this.userLogged });
    }
  }


}
