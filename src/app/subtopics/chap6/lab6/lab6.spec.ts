import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab6 } from './lab6';

describe('Lab6', () => {
  let component: Lab6;
  let fixture: ComponentFixture<Lab6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
