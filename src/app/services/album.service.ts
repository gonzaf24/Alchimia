import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})

export class AlbumService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }
  
  newAlbum(email,albums) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('albums/'+cleanEmail).set(albums);
  }

  editAlbum(email,albums) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('albums/'+cleanEmail+'/albums/').set(albums);
  }

  setAlbumStatus(album, status) {
    const cleanEmail = album.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('albums/'+cleanEmail+'/'+album.sender+'/status').set(status);
  }

  getAlbumsPorEmail(email) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('albums/'+cleanEmail+'/albums');
  }

  getAlbumPorID(email,uid) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('albums/'+cleanEmail+'/albums/uid/'+uid);
  }

  deleteAlbum(email,uid) {
    const cleanEmail = email.replace('.', ',');
    return  this.angularFireDatabase.object('albums/'+cleanEmail+'/albums/'+uid).remove() ;
  }

  getAlbumsToWall(){
    let startDate = new Date();
    let endDate = new Date();
    let formattedDateStart : any;
    let formattedDateEnd : any;
    startDate.setMonth(startDate.getMonth()-8);
    formattedDateStart=startDate.toISOString().slice(0,10);
    formattedDateEnd=endDate.toISOString().slice(0,10);



    return this.angularFireDatabase.list('albums/');
    //return this.angularFireDatabase.list('albums', ref => ref.orderByChild('fechaCreacion').startAt(formattedDateStart).endAt(formattedDateEnd));
  }

}
