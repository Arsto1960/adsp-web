import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter4 } from './chapter4';

describe('Chapter4', () => {
  let component: Chapter4;
  let fixture: ComponentFixture<Chapter4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
