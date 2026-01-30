import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic113 } from './subtopic113';

describe('Subtopic113', () => {
  let component: Subtopic113;
  let fixture: ComponentFixture<Subtopic113>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic113]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic113);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
