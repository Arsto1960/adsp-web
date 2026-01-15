import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic102 } from './subtopic102';

describe('Subtopic102', () => {
  let component: Subtopic102;
  let fixture: ComponentFixture<Subtopic102>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic102]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic102);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
