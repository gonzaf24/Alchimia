
import { Component, OnInit } from '@angular/core';
import { Actividad } from '../../interfaces/actividad';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-public-actividad',
  templateUrl: './public-actividad.component.html',
  styleUrls: ['./public-actividad.component.css']
})
export class PublicActividadComponent implements OnInit {
  userID: any;
  actividadID: any;
  actividad: Actividad;
  userLogged: User;
  actividadA: Actividad[];

  constructor(private activatedRoute: ActivatedRoute, 
    private usuarioService: UsuarioService, 
    private authenticationService: AuthenticationService) { 

      //this.actividadID = this.activatedRoute.snapshot.params['uid'];
      //this.userID = this.activatedRoute.snapshot.params['userUID'];

          

      this.userID= 'ELfThqYT2ngAyyEZRxThULJ5jAB3';
      this.actividadID = '1583971552063|ELfThqYT2ngAyyEZRxThULJ5jAB3';

     // this.actividadA = (this.usuarioService.getActividad(this.userID,this.actividadID).query.orderByChild('uid').equalTo(this.actividadID));
      
      /* this.usuarioService.getActividad(this.userID,this.actividadID).valueChanges().subscribe((data: User[]) =>{
        this.actividadA = data;
        alert(this.actividadA.length)
        
  }, (error) =>{
    alert("errror" + error);
  }); */
       
  }

  ngOnInit() {
    
  }

}

