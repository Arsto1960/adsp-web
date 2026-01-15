import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter10 } from './chapter10';

describe('Chapter10', () => {
  let component: Chapter10;
  let fixture: ComponentFixture<Chapter10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
