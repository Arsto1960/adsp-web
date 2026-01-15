import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab9 } from './lab9';

describe('Lab9', () => {
  let component: Lab9;
  let fixture: ComponentFixture<Lab9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
