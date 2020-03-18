import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userLogged: User;
  unaSolaVez: boolean;
  public fixed: boolean = false;
  routero:Router;

  constructor( 
    private router: Router, 
    private usuarioService: UsuarioService , 
    private authenticationService: AuthenticationService) { 
      this.routero = router;
    }

  ngOnInit() {
    this.authenticationService.getStatus().subscribe((status) => {
      if(status){
        this.usuarioService.getUserById(status.uid).valueChanges().subscribe( (data: User) => {
          this.userLogged = data;
        });
      }
    });  
  }

  irAtras(){
    window.history.back();
  }

  logout() {
    this.userLogged.status = "offline";
    this.usuarioService.editarUsuario(this.userLogged);
    this.authenticationService.logOut().then( ()=>{
      this.router.navigate(['public']);
    }).catch( (error) =>{
      console.log(error);
    });
  }


}
