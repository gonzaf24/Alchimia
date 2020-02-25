import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAmistadComponent } from './solicitudes-amistad.component';

describe('SolicitudesAmistadComponent', () => {
  let component: SolicitudesAmistadComponent;
  let fixture: ComponentFixture<SolicitudesAmistadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesAmistadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesAmistadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
