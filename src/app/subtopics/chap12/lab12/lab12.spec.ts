import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab12 } from './lab12';

describe('Lab12', () => {
  let component: Lab12;
  let fixture: ComponentFixture<Lab12>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab12]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab12);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
