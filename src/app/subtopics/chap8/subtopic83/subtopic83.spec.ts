import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic83 } from './subtopic83';

describe('Subtopic83', () => {
  let component: Subtopic83;
  let fixture: ComponentFixture<Subtopic83>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic83]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic83);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
