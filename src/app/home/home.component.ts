import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesAmistadService } from '../services/solicitudes-amistad.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
    private solicitudesAmistadService: SolicitudesAmistadService,) {

    this.usuarioService.getUsers().valueChanges().subscribe((data: User[]) =>{
      this.amigos = data;
    }, (error) =>{
      console.log(error);
    });

    this.authenticationService.getStatus().subscribe((status) => {
      this.usuarioService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        
        this.userLoged = data;

        if (this.userLoged.amigos) {

          this.userLoged.amigos = Object.values(this.userLoged.amigos);

          console.log(this.amigos);
        }

        console.log(this.userLoged);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
    
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
