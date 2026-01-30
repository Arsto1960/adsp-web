import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab11 } from './lab11';

describe('Lab11', () => {
  let component: Lab11;
  let fixture: ComponentFixture<Lab11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
