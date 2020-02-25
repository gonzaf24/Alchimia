import { Component, OnInit, Input } from '@angular/core';
import { User } from '../interfaces/user';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() uid: string;
  user: User;
  constructor(private userService: UsuarioService) { }

  ngOnInit() {
    console.log(this.uid);
    this.userService.getUserById(this.uid).valueChanges().subscribe((data: User) => {
      this.user = data;
    });
  }

}