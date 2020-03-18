import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPerfilComponent } from './public-perfil.component';

describe('PublicPerfilComponent', () => {
  let component: PublicPerfilComponent;
  let fixture: ComponentFixture<PublicPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
