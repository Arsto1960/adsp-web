import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab4 } from './lab4';

describe('Lab4', () => {
  let component: Lab4;
  let fixture: ComponentFixture<Lab4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
