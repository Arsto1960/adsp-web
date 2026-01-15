import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic1 } from './subtopic1';

describe('Subtopic1', () => {
  let component: Subtopic1;
  let fixture: ComponentFixture<Subtopic1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
