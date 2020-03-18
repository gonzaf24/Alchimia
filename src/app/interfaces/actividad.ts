export interface Actividad {
    uid?: any;  
    fechaCreacion?: Date;     // fecha creacion del album
    titulo?: string;          // el titulo de la actividad
    informacion?: string;     // toda la informacion de la actividad
    fechaInicio?: Date;       // fecha inicio actividad
    fechaFin?: Date;          // fecha fin actividad
    horaInicio?: string;      // 
    horaFin?: string;         // 
    direccion?: string;       //
    pais?: string;            //
    estadoCiudad?: string;    // 
    fotoPortada?: string;     // 
    profesionesRelacionadas?: string[]; // tags correspondiente a profesiones
    anotados?: string[];                // lista UID de los anotados a la actividad
    meGusta?: string[];                 // lista UID de a los que le gusta tu actividad
}