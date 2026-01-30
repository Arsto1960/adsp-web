import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab10 } from './lab10';

describe('Lab10', () => {
  let component: Lab10;
  let fixture: ComponentFixture<Lab10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
