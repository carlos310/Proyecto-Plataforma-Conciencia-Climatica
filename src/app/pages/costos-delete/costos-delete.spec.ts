import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosDelete } from './costos-delete';

describe('CostosDelete', () => {
  let component: CostosDelete;
  let fixture: ComponentFixture<CostosDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(CostosDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
