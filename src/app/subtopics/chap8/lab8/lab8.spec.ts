import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab8 } from './lab8';

describe('Lab8', () => {
  let component: Lab8;
  let fixture: ComponentFixture<Lab8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
