import { Component, OnInit } from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {UsuarioService} from '../../services/usuario.service';
import {SolicitudesAmistadService} from '../../services/solicitudes-amistad.service';
import { User } from 'src/app/interfaces/user';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}

@Component({
  selector: 'app-solicitudes-amistad',
  templateUrl: './solicitudes-amistad.component.html',
  styleUrls: ['./solicitudes-amistad.component.css']
})

export class SolicitudesAmistadComponent extends DialogComponent<PromptModel, any> implements PromptModel {
  scope: any;
  agregarlo: string = 'si';
  currentRequest: any;
  userSolicitud: User;

  constructor(public dialogService: DialogService, 
              private userService: UsuarioService,
              private usuarioService: UsuarioService,
              private solicitudesAmistadService: SolicitudesAmistadService) {
    super(dialogService);
  }

  ngOnInit(){
    this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe( (data: User) => {
      this.userSolicitud = data;
   });
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
