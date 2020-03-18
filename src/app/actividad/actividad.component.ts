import { Component, OnInit } from '@angular/core';
import { Actividad } from '../interfaces/actividad';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { ActividadService } from '../services/actividad.service';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  actividadID: any;
  userLogged: User;
  actividad: Actividad;
  actividades:Actividad[];

  constructor(private activatedRoute: ActivatedRoute, 
    private usuarioService: UsuarioService, 
    private actividadService: ActividadService,
    private authenticationService: AuthenticationService) { 

      this.actividadID = this.activatedRoute.snapshot.params['uid'];
        this.authenticationService.getStatus().subscribe((status) => {
            if(status){
              this.usuarioService.getUserById(status.uid).valueChanges().subscribe( (data: User) => {
                this.userLogged = data;
                if(this.userLogged){
                  this.actividadService.getActividadesPorEmail(this.userLogged.email).valueChanges().subscribe((data: Actividad[]) => {
                    this.actividades = data;
                    this.actividad = this.actividades.find(x => x.uid === this.actividadID);
                  });
                }
              });
            }
          }); 
  }

  ngOnInit() {
    
  }

}
