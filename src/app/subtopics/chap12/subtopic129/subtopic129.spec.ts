import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic129 } from './subtopic129';

describe('Subtopic129', () => {
  let component: Subtopic129;
  let fixture: ComponentFixture<Subtopic129>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic129]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic129);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
