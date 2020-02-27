import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../validators/must-match.validator';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  submittedLogin = false;
  operation: string = 'login';
  userLoged: User;
  userUID: string;
  error: string = null;
  exito: string = null;

  constructor(  private formBuilder: FormBuilder,
                private authenticationService: AuthenticationService, 
                private usuarioService: UsuarioService, 
                private router: Router) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          email: ['', [Validators.required,Validators.email]],
          password: ['', [Validators.required,Validators.minLength(6)]],
          confirmPassword: ['',Validators.required]
      }, {
          validator: MustMatch('password', 'confirmPassword')
      });
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required,Validators.email]],
          password: ['', [Validators.required,Validators.minLength(6)]]
      });
  }

  get f() { return this.registerForm.controls; }
  get g() { return this.loginForm.controls; }

  login(){
    this.submittedLogin = true;
    if (this.loginForm.invalid) {
        return;
    }
    this.authenticationService.loginWithEmail( this.loginForm.get('email').value , this.loginForm.get('password').value).then( (data)=>{
      this.userUID = data.user.uid;
      this.usuarioService.getUserById(this.userUID).valueChanges().subscribe((user: User) => {
        this.userLoged = user;
        this.userLoged.status = "online";
        this.usuarioService.editarUsuario(this.userLoged);   
      }, (error) => {
        this.error=error;
        console.log(error);
      });
      this.router.navigate(['home']);
    }).catch( (error) => {
      this.error=error;
      console.log(error);
    })
  }

  registrarse(){
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    this.authenticationService.registerWithEmail( this.registerForm.get('email').value, this.registerForm.get('password').value).then( (data)=>{
     
      const usuario = {
        uid: data.user.uid,
        email: this.registerForm.get('email').value
      };
      this.usuarioService.crearUsuario(usuario).then((data2) => {
          this.exito = "se ha registrado correctamente";
          this.error = null;
          console.log(data2);
      }).catch( (error) =>{
          this.error=error;
          console.log(error);
      })
    }).catch( (error) => {
      this.error=error;
      console.log(error);
    })
  }

}
