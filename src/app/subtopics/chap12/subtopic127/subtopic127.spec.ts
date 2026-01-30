import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic127 } from './subtopic127';

describe('Subtopic127', () => {
  let component: Subtopic127;
  let fixture: ComponentFixture<Subtopic127>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic127]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic127);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
