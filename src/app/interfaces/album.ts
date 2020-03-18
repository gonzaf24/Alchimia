export interface Album {
    uid: any;                // identificador unico
    fechaCreacion?: Date;     // fecha creacion del album
    titulo?: string;          // el titulo del abum
    subtitulo?: string;      // el subtitulo corresponde a la portada del album
    fotoPortada?: string;    // imagen de la portada del album (afuera)
    contenido?: string;      // texto del contenido dentro del album
    autor?: string;          // nombre a mostrar como autor de la galeria
    galeriaFotos?: string[]; // lista de Strings con las fotos de la galeria 
    galeriaVideos?: string[];// lista de Strings con las URLs de videos
    
}