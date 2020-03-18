import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage} from 'ngx-gallery';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UsuarioService } from '../services/usuario.service';
import { User } from '../interfaces/user';
import { Album } from '../interfaces/album';
import { AlbumService } from '../services/album.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[] = [];
    userLogged: User;
    albumID: any;
    album: Album;
    albums:Album[];

    constructor(private activatedRoute: ActivatedRoute, 
                private usuarioService: UsuarioService, 
                private albumService : AlbumService,
                private authenticationService: AuthenticationService){

                this.albumID = this.activatedRoute.snapshot.params['uid'];
                this.authenticationService.getStatus().subscribe((status) => {
                    if(status){
                      this.usuarioService.getUserById(status.uid).valueChanges().subscribe( (data: User) => {
                        this.userLogged = data;
                        if(this.userLogged){
                          this.albumService.getAlbumsPorEmail(this.userLogged.email).valueChanges().subscribe((data: Album[]) => {
                            this.albums = data;
                            this.album = this.albums.find(x => x.uid === this.albumID);
                            for( let i=0 ; i < this.album.galeriaFotos.length ; i ++ ){
                              this.galleryImages.push({   small: this.album.galeriaFotos[i],
                                                          medium: this.album.galeriaFotos[i],
                                                          big: this.album.galeriaFotos[i]}) 
                            }
                          });
                        }
                      });
                    }
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