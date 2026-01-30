import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic2 } from './subtopic2';

describe('Subtopic2', () => {
  let component: Subtopic2;
  let fixture: ComponentFixture<Subtopic2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
