import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic101 } from './subtopic101';

describe('Subtopic101', () => {
  let component: Subtopic101;
  let fixture: ComponentFixture<Subtopic101>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic101]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic101);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
