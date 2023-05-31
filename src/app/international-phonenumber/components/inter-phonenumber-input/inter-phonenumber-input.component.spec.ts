import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterPhonenumberInputComponent } from './inter-phonenumber-input.component';

describe('InterPhonenumberInputComponent', () => {
  let component: InterPhonenumberInputComponent;
  let fixture: ComponentFixture<InterPhonenumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterPhonenumberInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterPhonenumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
