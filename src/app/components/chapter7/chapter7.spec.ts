import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter7 } from './chapter7';

describe('Chapter7', () => {
  let component: Chapter7;
  let fixture: ComponentFixture<Chapter7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
