
import { Component, OnInit } from '@angular/core';
import { Actividad } from '../../interfaces/actividad';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../interfaces/user';
import { ActividadService } from 'src/app/services/actividad.service';

@Component({
  selector: 'app-public-actividad',
  templateUrl: './public-actividad.component.html',
  styleUrls: ['./public-actividad.component.css']
})
export class PublicActividadComponent implements OnInit {
  actividadID: any;
  email: any;
  actividad: Actividad;
  actividades: Actividad[];
  userLogged: User;
  usuario: User;

  constructor(private activatedRoute: ActivatedRoute, 
              private usuarioService: UsuarioService, 
              private actividadService: ActividadService, 
              private authenticationService: AuthenticationService) { 

      this.actividadID = this.activatedRoute.snapshot.params['uid'];
      this.email = this.activatedRoute.snapshot.params['email'];

      this.actividadService.getActividadesPorEmail(this.email).valueChanges().subscribe((data: Actividad[]) =>{
        this.actividades = data;
        let freno: Boolean;
        for(let i= 0 ; i < this.actividades.length && !freno; i++){
          let act = this.actividades[i]
          if(act.uid === this.actividadID){
            this.actividad = act;
            freno=true;
          }
        }
      }, (error) =>{
        alert("errror" + error);
      }); 

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

      this.usuarioService.getUserByEmail(this.email).valueChanges().subscribe((data: User[]) =>{
        let usuarios = data;
        if(usuarios){
          this.usuario = usuarios[0];
        }
      }, (error) =>{
        alert("errror" + error);
      });

       
  }

  ngOnInit() {
    
  }

}

