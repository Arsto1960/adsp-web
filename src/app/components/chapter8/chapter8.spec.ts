import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter8 } from './chapter8';

describe('Chapter8', () => {
  let component: Chapter8;
  let fixture: ComponentFixture<Chapter8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
