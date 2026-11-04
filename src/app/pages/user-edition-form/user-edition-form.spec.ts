import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditionForm } from './user-edition-form';

describe('UserEditionForm', () => {
  let component: UserEditionForm;
  let fixture: ComponentFixture<UserEditionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
