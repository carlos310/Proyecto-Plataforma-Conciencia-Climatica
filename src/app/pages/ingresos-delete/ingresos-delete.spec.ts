import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosDelete } from './ingresos-delete';

describe('IngresosDelete', () => {
  let component: IngresosDelete;
  let fixture: ComponentFixture<IngresosDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresosDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
