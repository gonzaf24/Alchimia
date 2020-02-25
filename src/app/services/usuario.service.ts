import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from 'angularfire2/database';

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
  
  crearUsuario(usuario){
    return this.angularFireDatabase.object( '/usuarios/' + usuario.uid).set(usuario);
  }

  editarUsuario(usuario){
    return this.angularFireDatabase.object( '/usuarios/' + usuario.uid).set(usuario);
  }

  guardarImagenPerfil(avatar, uid){
    return this.angularFireDatabase.object( '/usuarios/' + uid + '/avatar/').set(avatar);
  }

  agregarAmigo(usuarioId, amigoId) {
    this.angularFireDatabase.object( 'usuarios/' + usuarioId + '/amigos/' + amigoId).set(amigoId);
    return this.angularFireDatabase.object('usuarios/' + amigoId + '/amigos/' + usuarioId).set(usuarioId);
  }

}
