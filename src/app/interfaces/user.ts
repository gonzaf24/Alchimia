import { Album } from './album';
import { Actividad } from './actividad';

export interface User {
uid: any;              // identificador unico
email: string;         // direccion de correo electronico
status?: string;       // conectado/desconectado
avatar?: string;       // imagen de perfil
nombre?: string;       // nombre
apellido?: string;     // apellido
sexo?: string;         // sexo Sr Sra T@des
pais?: string;         // ej Alemania // no hay codigos
estadoCiudad?: string; // ej Berlin   // no hay codigos
telefono?: string;     // telefono
notificar: boolean;    // boolean para saber si realizar notificaciones al susuario
fechaNacimiento?: Date;// fecha nacimiento
fechaCreacion?: Date;
profesiones?: string[];// lista de Strings con las profesiones de esta persona 
intereses?: string[];  // lista de Strings con las profesiones que le interesa a esta persona 

}
