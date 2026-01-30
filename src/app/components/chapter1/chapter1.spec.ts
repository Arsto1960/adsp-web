import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter1 } from './chapter1';

describe('Chapter1', () => {
  let component: Chapter1;
  let fixture: ComponentFixture<Chapter1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
