import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosCreate } from './costos-create';

describe('CostosCreate', () => {
  let component: CostosCreate;
  let fixture: ComponentFixture<CostosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CostosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
