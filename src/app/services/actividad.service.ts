import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})

export class ActividadService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }
  
  newActividad(email,actividades) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('actividades/'+cleanEmail).set(actividades);
  }

  editActividad(email,actividades) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('actividades/'+cleanEmail+'/actividades/').set(actividades);
  }

  setActividadStatus(actividad, status) {
    const cleanEmail = actividad.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('actividades/'+cleanEmail+'/'+actividad.sender+'/status').set(status);
  }

  getActividadesPorEmail(email) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('actividades/'+cleanEmail+'/actividades');
  }


  getActividadPorID(email,uid) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.object('actividades/'+cleanEmail+'/actividades/uid/'+uid);
  }

  deleteActividad(email,uid) {
    const cleanEmail = email.replace('.', ',');
    return  this.angularFireDatabase.object('actividades/'+cleanEmail+'/'+uid).remove() ;
  }

  getActividadesToWall(){
    let startDate = new Date();
    let endDate = new Date();
    let formattedDateStart : any;
    let formattedDateEnd : any;
    startDate.setMonth(startDate.getMonth()-8);
    formattedDateStart=startDate.toISOString().slice(0,10);
    endDate.setMonth(startDate.getMonth()+8);
    formattedDateEnd=endDate.toISOString().slice(0,10);
    //alert("desde: " + formattedDateStart+" hasta : " +formattedDateEnd );

    return this.angularFireDatabase.list('actividades/');

    //return this.angularFireDatabase.list('actividades/gon@gon,com/actividades/', ref => ref.orderByChild('fechaCreacion').startAt(formattedDateStart).endAt(formattedDateEnd));
  }

}
