import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  operation: string = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;
  userLoged: User;
  userUID: string;

  constructor( private authenticationService: AuthenticationService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.authenticationService.loginWithEmail( this.email, this.password).then( (data)=>{
      this.userUID = data.user.uid;
      this.usuarioService.getUserById(this.userUID).valueChanges().subscribe((user: User) => {
        this.userLoged = user;
        this.userLoged.status = "online";
        this.usuarioService.editarUsuario(this.userLoged);   
      }, (error) => {
        alert(error);
        console.log(error);
      });
      this.router.navigate(['home']);
    }).catch( (error) => {
      alert(error);
      console.log(error);
    })
  }

  registrarse(){

    this.authenticationService.registerWithEmail( this.email, this.password).then( (data)=>{

      const usuario = {
        uid: data.user.uid,
        email: this.email,
        nick: this.nick
      };
      alert('voy a crearlo');
      this.usuarioService.crearUsuario(usuario).then((data2) => {

          alert('registrado correctamente');
          console.log(data2);

      }).catch( (error) =>{
          console.log(error);
      })
      
    }).catch( (error) => {
      alert('hubo algun error al registrarse');
      console.log('hubo algun error al registrarse');
      console.log(error);
    })
  }

}
