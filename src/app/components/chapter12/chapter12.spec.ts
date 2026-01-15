import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter12 } from './chapter12';

describe('Chapter12', () => {
  let component: Chapter12;
  let fixture: ComponentFixture<Chapter12>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter12]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter12);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
