import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab2 } from './lab2';

describe('Lab2', () => {
  let component: Lab2;
  let fixture: ComponentFixture<Lab2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
