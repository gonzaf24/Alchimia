export interface User {

nick: string;
subnick?: string; // el signo de ? indica que es opcional 
status?: string;
edad?: number;
email: string;
friend: boolean;
avatar?: string;
uid: any;
amigos: any;

}
