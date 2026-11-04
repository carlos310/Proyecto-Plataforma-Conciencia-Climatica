import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletionForm } from './user-deletion-form';

describe('UserDeletionForm', () => {
  let component: UserDeletionForm;
  let fixture: ComponentFixture<UserDeletionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeletionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeletionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
