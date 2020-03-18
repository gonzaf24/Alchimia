import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.css']
})

export class PublicComponent implements OnInit {

    ngOnInit(): void {
    }

    constructor(private router: Router) {
    }

}
