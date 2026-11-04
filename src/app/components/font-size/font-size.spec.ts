import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontSize } from './font-size.js';

describe('FontSize', () => {
  let component: FontSize;
  let fixture: ComponentFixture<FontSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontSize],
    }).compileComponents();

    fixture = TestBed.createComponent(FontSize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
