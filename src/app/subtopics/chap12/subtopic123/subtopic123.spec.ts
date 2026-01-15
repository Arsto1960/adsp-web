import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic123 } from './subtopic123';

describe('Subtopic123', () => {
  let component: Subtopic123;
  let fixture: ComponentFixture<Subtopic123>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic123]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic123);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
