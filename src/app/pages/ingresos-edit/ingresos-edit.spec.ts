import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosEdit } from './ingresos-edit';

describe('IngresosEdit', () => {
  let component: IngresosEdit;
  let fixture: ComponentFixture<IngresosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
