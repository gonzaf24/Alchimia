import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicActividadComponent } from './public-actividad.component';

describe('PublicActividadComponent', () => {
  let component: PublicActividadComponent;
  let fixture: ComponentFixture<PublicActividadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicActividadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
