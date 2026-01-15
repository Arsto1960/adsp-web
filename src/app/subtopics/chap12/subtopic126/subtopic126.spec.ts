import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic126 } from './subtopic126';

describe('Subtopic126', () => {
  let component: Subtopic126;
  let fixture: ComponentFixture<Subtopic126>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic126]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic126);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
