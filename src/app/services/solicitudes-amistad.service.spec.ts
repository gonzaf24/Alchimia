import { TestBed } from '@angular/core/testing';

import { SolicitudesAmistadService } from './solicitudes-amistad.service';

describe('SolicitudesAmistadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolicitudesAmistadService = TestBed.get(SolicitudesAmistadService);
    expect(service).toBeTruthy();
  });
});
