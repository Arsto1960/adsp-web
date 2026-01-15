import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter5 } from './chapter5';

describe('Chapter5', () => {
  let component: Chapter5;
  let fixture: ComponentFixture<Chapter5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
