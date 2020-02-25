import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesAmistadService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }
  
  newSolicitud(solicitud) {
    const cleanEmail = solicitud.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('solicitudes/' + cleanEmail + '/' + solicitud.sender).set(solicitud);
  }
  setSolicitudestStatus(solicitud, status) {
    const cleanEmail = solicitud.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('solicitudes/' + cleanEmail + '/' + solicitud.sender + '/status').set(status);
  }
  getSolicitudesPorEmail(email) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('solicitudes/' + cleanEmail);
  }
}