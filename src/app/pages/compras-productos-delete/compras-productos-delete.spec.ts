import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProductosDelete } from './compras-productos-delete';

describe('ComprasProductosDelete', () => {
  let component: ComprasProductosDelete;
  let fixture: ComponentFixture<ComprasProductosDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasProductosDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasProductosDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
