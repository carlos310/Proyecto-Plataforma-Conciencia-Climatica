import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosHidricos } from './recursos-hidricos';

describe('RecursosHidricos', () => {
  let component: RecursosHidricos;
  let fixture: ComponentFixture<RecursosHidricos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosHidricos],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursosHidricos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
