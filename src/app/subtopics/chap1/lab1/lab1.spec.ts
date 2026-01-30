import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab1 } from './lab1';

describe('Lab1', () => {
  let component: Lab1;
  let fixture: ComponentFixture<Lab1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
