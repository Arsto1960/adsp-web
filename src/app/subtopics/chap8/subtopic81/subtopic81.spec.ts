import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic81 } from './subtopic81';

describe('Subtopic81', () => {
  let component: Subtopic81;
  let fixture: ComponentFixture<Subtopic81>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic81]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic81);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
