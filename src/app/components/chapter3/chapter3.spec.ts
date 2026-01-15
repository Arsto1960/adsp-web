import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter3 } from './chapter3';

describe('Chapter3', () => {
  let component: Chapter3;
  let fixture: ComponentFixture<Chapter3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
