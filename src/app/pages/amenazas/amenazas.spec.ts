import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amenazas } from './amenazas';

describe('Amenazas', () => {
  let component: Amenazas;
  let fixture: ComponentFixture<Amenazas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Amenazas],
    }).compileComponents();

    fixture = TestBed.createComponent(Amenazas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
