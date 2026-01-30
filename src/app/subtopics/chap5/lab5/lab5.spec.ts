import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab5 } from './lab5';

describe('Lab5', () => {
  let component: Lab5;
  let fixture: ComponentFixture<Lab5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
