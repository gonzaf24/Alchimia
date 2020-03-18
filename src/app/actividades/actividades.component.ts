import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { AngularFireStorage } from 'angularfire2/storage';
import { User } from '../interfaces/user';
import { CrearActividadComponent } from '../modales/crear-actividad/crear-actividad.component';
import { Actividad } from '../interfaces/actividad';
import { EditarActividadComponent } from '../modales/editar-actividad/editar-actividad.component';
import { ActividadService } from '../services/actividad.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})

export class ActividadesComponent implements OnInit {

  actividad: Actividad;
  userLogged: User;
  actividades:Actividad[]=[];

  constructor(private usuarioService: UsuarioService , 
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private firebaseStorage: AngularFireStorage,
    private actividadService: ActividadService) { 
      
      this.authenticationService.getStatus().subscribe((status) => {
        if (status) {
          this.usuarioService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
            this.userLogged = data;
            if (this.userLogged) {
              this.actividadService.getActividadesPorEmail(this.userLogged.email).valueChanges().subscribe((data: Actividad[]) => {
                this.actividades = data;
              });
            }
          });
        }
      });

    }

  ngOnInit() {
    this.actividades.sort((a: Actividad, b: Actividad) => +new Date(b.fechaCreacion) - +new Date(a.fechaCreacion));

  }

  editarActividad(activ:Actividad){
    this.actividad = activ;
    this.dialogService.addDialog( EditarActividadComponent , { scope: this , currentRequest: activ });
  }

  crearActividad(){
    if(this.userLogged){
      this.dialogService.addDialog(CrearActividadComponent, { scope: this, currentRequest: this.userLogged });
    }
  }

  eliminarActividad(act:Actividad){

    if(act.fotoPortada){
      var desertRef = this.firebaseStorage.storage.refFromURL(act.fotoPortada)
      desertRef.delete().then(function() {
      }).catch(function(error) {
        alert('Hubo un error' + error);
      }); 
    }

    this.actividades = this.actividades.filter(obj => obj !== act);
    this.actividadService.editActividad(this.userLogged.email, this.actividades).then(() => {
    }).catch((error) => {
      alert('Hubo un error el eliminar' + error);
    });
    
  }

}
