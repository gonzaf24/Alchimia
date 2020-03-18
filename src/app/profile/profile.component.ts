import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { DialogService } from 'ng2-bootstrap-modal';
import { EditarUsuarioComponent } from '../modales/editar-usuario/editar-usuario.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
 
  userLogged: User;
  envioUnaVez: boolean;

  constructor(private userService: UsuarioService, 
              private authenticationService: AuthenticationService,
              private dialogService: DialogService) {
    this.authenticationService.getStatus().subscribe((status) => {
      if(status){
        this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
            this.userLogged = data;
            console.log(this.userLogged);
        }, (error) => {
          console.log(error);
        });
      } 
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
        
  }

  editar(){
      this.envioUnaVez = true;
      this.authenticationService.getStatus().subscribe((status) => {
        this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.userLogged = data;
        if(this.userLogged && this.envioUnaVez){
          this.envioUnaVez = false;
          this.dialogService.addDialog(EditarUsuarioComponent, { scope: this, currentRequest: this.userLogged });
        }
      });
    })
  }

}
