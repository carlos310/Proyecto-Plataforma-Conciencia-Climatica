import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosEdit } from './costos-edit';

describe('CostosEdit', () => {
  let component: CostosEdit;
  let fixture: ComponentFixture<CostosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CostosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
