import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosDelete } from './gastos-delete';

describe('GastosDelete', () => {
  let component: GastosDelete;
  let fixture: ComponentFixture<GastosDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(GastosDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
