import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { Actividad } from 'src/app/interfaces/actividad';
import { Album } from 'src/app/interfaces/album';
import { ActividadService } from 'src/app/services/actividad.service';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-public-perfil',
  templateUrl: './public-perfil.component.html',
  styleUrls: ['./public-perfil.component.css']
})
export class PublicPerfilComponent implements OnInit {

  email: any;
  usuario: User;
  userLogged: User;
  actividades: Actividad[];
  albums: Album[];

  constructor(private activatedRoute: ActivatedRoute, 
    private usuarioService: UsuarioService, 
    private actividadService: ActividadService,
    private albumService: AlbumService,
    private authenticationService: AuthenticationService) { 
      

      this.email = this.activatedRoute.snapshot.params['email'];

      this.usuarioService.getUserByEmail(this.email).valueChanges().subscribe((data: User[]) =>{
            let usuarios = data;
            if(usuarios){
              this.usuario = usuarios[0];
            }
      }, (error) =>{
        alert("errror" + error);
      });


      this.actividadService.getActividadesPorEmail(this.email).valueChanges().subscribe((data: Actividad[]) => {
        this.actividades = data;
      });

      this.albumService.getAlbumsPorEmail(this.email).valueChanges().subscribe((data: Album[]) => {
        this.albums = data;
      });

      this.authenticationService.getStatus().subscribe((status) => {
            if(status){
                this.usuarioService.getUserById(status.uid).valueChanges().subscribe( (data: User) => {
                    this.userLogged = data;
                });
            }
      }); 
    }

  ngOnInit() {
        
  }

}