import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter6 } from './chapter6';

describe('Chapter6', () => {
  let component: Chapter6;
  let fixture: ComponentFixture<Chapter6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
