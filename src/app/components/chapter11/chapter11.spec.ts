import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter11 } from './chapter11';

describe('Chapter11', () => {
  let component: Chapter11;
  let fixture: ComponentFixture<Chapter11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
