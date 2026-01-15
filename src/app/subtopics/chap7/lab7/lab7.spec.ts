import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab7 } from './lab7';

describe('Lab7', () => {
  let component: Lab7;
  let fixture: ComponentFixture<Lab7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
