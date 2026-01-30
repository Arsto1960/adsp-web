import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter2 } from './chapter2';

describe('Chapter2', () => {
  let component: Chapter2;
  let fixture: ComponentFixture<Chapter2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
