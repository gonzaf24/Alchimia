import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { FirebaseStorage } from 'angularfire2';
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  amigoID: any;
  amigos: User[];
  amigo: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any[];
  shake: boolean = false;
  private imgSrc: any = '';
  picture: any;

  constructor(private firebaseStorage: AngularFireStorage ,
              private authService:AuthenticationService, 
              private activatedRoute: ActivatedRoute, 
              private usuarioService: UsuarioService, 
              private conversationService: ConversationService) { 
    
    //obtengo el parametro
    this.amigoID = this.activatedRoute.snapshot.params['uid'];
    
    this.authService.getStatus().subscribe((session)=>{
      this.usuarioService.getUserById(session.uid).valueChanges().subscribe( (user: User)=>{
        this.user = user;
        this.usuarioService.getUserById(this.amigoID).valueChanges().subscribe( (data: User) =>{
          this.amigo = data;
          const ids = [this.user.uid, this.amigo.uid].sort();
          this.conversation_id = ids.join('|');
          this.getConversation();
        }, (error) =>{
            console.log(error);
        })
      })
    })
  }

  ngOnInit() {
  }

  enviarMensaje() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.amigo.uid
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  getConversation(){
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe((data)=>{
    this.conversation = data;
    this.conversation.forEach((message)=>{
      if(!message.seen){
        message.seen = true;
        this.conversationService.editConversation(message);
        const audio = new Audio ('assets/sound/new_message.m4a');
        audio.play();
      }if(message.type == 'zumbido' && message.seen == false){
        this.enviarZumbido();
      }
    });
  },
  (error)=>{console.log(error);})
  }
  
  enviarZumbido(){
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.amigo.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message).then(() => this.textMessage = '');

    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(()=>{
      this.shake =  false;
    },1000  );
  }

  enviarFotoChat(event: any) {
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/ ;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imgSrc = reader.result;
    console.log(this.imgSrc)
    this.sendImage();
  }

  private sendImage() {

    if (this.imgSrc) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.imgSrc, 'data_url');

      pictures.then(() => {
        
        this.picture = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();

        this.picture.subscribe( (pictureUrl) => {
          console.log(pictureUrl);

          const message = {
            uid: this.conversation_id,
            timestamp: Date.now(),
            text: null,
            sender: this.user.uid,
            receiver: this.amigo.uid,
            url: pictureUrl,
            type: 'imagenChat'
          };

          this.conversationService.createConversation(message).then(() => this.textMessage = '')
            .then(() => console.log('conversacion creada correctamente'))
            .catch(() => console.log('error creando conversaciom'));

        }).then(() => console.log('foto en conversacion enviada correctamente')).catch(() => console.log('error subiendo foto'));

      }).catch(()=>{
        console.log('error obteniendo url. ');
      });
    }

  }
 
  getUserNickById(id) {
    if (id === this.amigo.uid) {
      return this.amigo.nick;
    } else {
      return this.user.nick;
    }
  } 
}
