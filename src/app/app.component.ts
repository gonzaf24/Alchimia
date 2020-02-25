import { Component } from '@angular/core';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UsuarioService } from './services/usuario.service';
import { SolicitudesAmistadService } from './services/solicitudes-amistad.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { SolicitudesAmistadComponent } from './modales/solicitudes-amistad/solicitudes-amistad.component';

@Component({
  selector: 'app-root', /* */
  templateUrl: './app.component.html', /* indica que archivo de html template*/
  styleUrls: ['./app.component.css'] /* para cada componente un solo archivo css*/
})
export class AppComponent {
  title = 'alchimia';
  
  userLogged: User; //usuario logueado
  userSolicitud: User; //usuario que envio la solicitud
  solicitudes: any[] = [];
  mailsShown: any[] = [];

  constructor(public router: Router, private authenticationService: AuthenticationService, private userService: UsuarioService, private solicitudesAmistadService: SolicitudesAmistadService, private dialogService: DialogService) {
    /* this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserById(status.uid).valueChanges().subscribe( (data: User) => {
        this.userLogged = data;
        this.solicitudesAmistadService.getSolicitudesPorEmail(this.userLogged.email).valueChanges().subscribe((requests: any) => {
          this.solicitudes = requests;
          this.solicitudes = this.solicitudes.filter( (solicitud) => {
            return solicitud.status == 'pendiente' ;
          });
          this.solicitudes.forEach((solicitud) => {
            if (this.mailsShown.indexOf(solicitud.sender) === -1) {
              this.mailsShown.push((solicitud.sender));
              this.dialogService.addDialog(SolicitudesAmistadComponent, { scope: this, currentRequest: solicitud });
            }
          });
        }, (error) => {
          console.log(error);
        });
      });
    }); */
  }
}