import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosCreate } from './ingresos-create';

describe('IngresosCreate', () => {
  let component: IngresosCreate;
  let fixture: ComponentFixture<IngresosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
