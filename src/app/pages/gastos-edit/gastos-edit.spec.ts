import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosEdit } from './gastos-edit';

describe('GastosEdit', () => {
  let component: GastosEdit;
  let fixture: ComponentFixture<GastosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(GastosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
