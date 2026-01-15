import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic124 } from './subtopic124';

describe('Subtopic124', () => {
  let component: Subtopic124;
  let fixture: ComponentFixture<Subtopic124>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic124]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic124);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
