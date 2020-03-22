import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Album } from 'src/app/interfaces/album';
import { AlbumService } from 'src/app/services/album.service';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-public-album',
  templateUrl: './public-album.component.html',
  styleUrls: ['./public-album.component.css']
})

export class PublicAlbumComponent implements OnInit {
  
  albumID: any;
  email: any;
  album: Album;
  userLogged: User;
  albums: Album[];
  usuario: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private activatedRoute: ActivatedRoute, 
              private usuarioService: UsuarioService, 
              private albumService: AlbumService, 
              private authenticationService: AuthenticationService) { 

      this.albumID = this.activatedRoute.snapshot.params['uid'];
      this.email = this.activatedRoute.snapshot.params['email'];

      this.albumService.getAlbumPorID(this.email,this.albumID).valueChanges().subscribe((data: Album) =>{
        this.album = data;
      }, (error) =>{
        alert("errror" + error);
      }); 

      this.albumService.getAlbumsPorEmail(this.email).valueChanges().subscribe((data: Album[]) =>{
        this.albums = data;
        let freno: Boolean;
        for(let i= 0 ; i < this.albums.length && !freno; i++){
          let alb = this.albums[i]
          if(alb.uid === this.albumID){
            this.album = alb;
            for( let i=0 ; i < this.album.galeriaFotos.length ; i ++ ){
              this.galleryImages.push({ small: this.album.galeriaFotos[i],
                                        medium: this.album.galeriaFotos[i],
                                        big: this.album.galeriaFotos[i]}) 
            }
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

    ngOnInit(): void {
      this.galleryOptions = [
        { layout: "thumbnails-top" ,
          imageArrowsAutoHide: false, 
          thumbnailsArrowsAutoHide: false,
          previewCloseOnClick: true, 
          previewCloseOnEsc: true},
        { breakpoint: 500, 
            width: "300px", 
            height: "300px", 
            thumbnailsColumns: 3 },
        { breakpoint: 300, 
            width: "100%", 
            height: "200px", 
            thumbnailsColumns: 2 }
    ];
    }

}
