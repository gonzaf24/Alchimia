import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root', /* el seelctor */
  templateUrl: './app.component.html', /* indica que archivo de html template*/
  styleUrls: ['./app.component.css'] /* para cada componente un solo archivo css*/
})
export class AppComponent {
  title = 'alchimia';
  
  constructor(public router: Router) {
   
  }

}