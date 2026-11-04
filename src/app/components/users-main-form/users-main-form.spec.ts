import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMainForm } from './users-main-form.js';

describe('UsersMainForm', () => {
  let component: UsersMainForm;
  let fixture: ComponentFixture<UsersMainForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersMainForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersMainForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
