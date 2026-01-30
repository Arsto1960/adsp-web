import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter9 } from './chapter9';

describe('Chapter9', () => {
  let component: Chapter9;
  let fixture: ComponentFixture<Chapter9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
