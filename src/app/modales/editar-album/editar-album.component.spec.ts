import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlbumComponent } from './editar-album.component';

describe('EditarAlbumComponent', () => {
  let component: EditarAlbumComponent;
  let fixture: ComponentFixture<EditarAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
