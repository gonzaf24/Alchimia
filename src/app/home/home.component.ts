import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesAmistadService } from '../services/solicitudes-amistad.service';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from '../services/countries.service';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from 'angularfire2/storage';

interface Sex {
  value: string;
  viewValue: string;
}
interface Pais {
  value: string;
  viewValue: string;
}
interface Ciudad {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
  
})


export class HomeComponent implements OnInit {

  amigos: User[];
  query: string = '';
  userLoged: User;
  amigoEmail: string = '';

  constructor(private usuarioService: UsuarioService , 
    private authenticationService: AuthenticationService, 
    private router: Router, 
    private modalService: NgbModal, 
    private country:CountriesService,
    private solicitudesAmistadService: SolicitudesAmistadService,private _formBuilder: FormBuilder,
    private userService: UsuarioService, 
    private firebaseStorage: AngularFireStorage) {

  }
  
  ngOnInit() {
    
  }

  logout() {
    this.userLoged.status = "offline";
    this.usuarioService.editarUsuario(this.userLoged);
    this.authenticationService.logOut().then( ()=>{
      this.router.navigate(['login']);
    }).catch( (error) =>{
      console.log(error);
    });
  }

  agregarAmigo(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  enviarSolicitud() {
    const solicitud = {
      timestamp: Date.now(),
      receiver_email: this.amigoEmail,
      sender: this.userLoged.uid,
      sender_email: this.userLoged.email,
      status: 'pendiente'
    };
    this.solicitudesAmistadService.newSolicitud(solicitud).then(() => {
      alert('Se envio la solicitud');
    }).catch((error) => {
      alert('Hubo un error');
      console.log(error);
    });
  }

}
