import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  

  amigosService: User[];

  constructor(private angularFireDatabase: AngularFireDatabase) { 

  }

  getUsers(){ 
    return this.angularFireDatabase.list( '/usuarios');
  }


  getUserById(uid){
    return this.angularFireDatabase.object( '/usuarios/' + uid);
  }

  getUserByEmail(email){
    return this.angularFireDatabase.list('usuarios', ref => ref.orderByChild('email').equalTo(email));
  }

  getUserToWall(){
          let startDate = new Date();
          let endDate = new Date();
          let formattedDateStart : any;
          let formattedDateEnd : any;
          startDate.setMonth(startDate.getMonth()-8);
          formattedDateStart=startDate.toISOString().slice(0,10);

          endDate.setMonth(endDate.getMonth()+8);
          formattedDateEnd=endDate.toISOString().slice(0,10);

    return this.angularFireDatabase.list('usuarios', ref => ref.orderByChild('fechaCreacion').startAt(formattedDateStart).endAt(formattedDateEnd));
  }


  getActividades() {

          let startDate = new Date();
          let endDate = new Date();
          let formattedDateStart : any;
          let formattedDateEnd : any;
          startDate.setMonth(startDate.getMonth()-8);
          formattedDateStart=startDate.toISOString().slice(0,10);

          endDate.setMonth(endDate.getMonth()+8);
          formattedDateEnd=endDate.toISOString().slice(0,10);

     
    return this.angularFireDatabase.list('/usuarios/', ref => ref.orderByChild('actividades'));
  }
  
  crearUsuario(usuario){
    return this.angularFireDatabase.object( '/usuarios/' + usuario.uid).set(usuario);
  }

  editarUsuario(usuario){
    return this.angularFireDatabase.object( '/usuarios/' + usuario.uid).set(usuario);
  }

  guardarImagenPerfil(avatar, uid){
    return this.angularFireDatabase.object( '/usuarios/' + uid + '/avatar/').set(avatar);
  }

  agregarImagenesGaleria(usuarioId, album) {
    return this.angularFireDatabase.object( 'usuarios/' + usuarioId + '/galeriaFotos/' + album.uid).set(album.galeriaFotos);
  }

  agregarAmigo(usuarioId, amigoId) {
           this.angularFireDatabase.object('usuarios/' + usuarioId + '/amigos/' + amigoId).set(amigoId);
    return this.angularFireDatabase.object('usuarios/' + amigoId + '/amigos/' + usuarioId).set(usuarioId);
  }

}
