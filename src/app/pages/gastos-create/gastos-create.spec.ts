import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCreate } from './gastos-create';

describe('GastosCreate', () => {
  let component: GastosCreate;
  let fixture: ComponentFixture<GastosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(GastosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
