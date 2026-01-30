import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic31 } from './subtopic31';

describe('Subtopic31', () => {
  let component: Subtopic31;
  let fixture: ComponentFixture<Subtopic31>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic31]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic31);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
