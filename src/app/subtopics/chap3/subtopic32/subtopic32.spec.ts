import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic32 } from './subtopic32';

describe('Subtopic32', () => {
  let component: Subtopic32;
  let fixture: ComponentFixture<Subtopic32>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic32]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic32);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
