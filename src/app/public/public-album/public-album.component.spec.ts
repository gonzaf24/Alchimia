import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAlbumComponent } from './public-album.component';

describe('PublicAlbumComponent', () => {
  let component: PublicAlbumComponent;
  let fixture: ComponentFixture<PublicAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
