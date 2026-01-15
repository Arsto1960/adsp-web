import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic121 } from './subtopic121';

describe('Subtopic121', () => {
  let component: Subtopic121;
  let fixture: ComponentFixture<Subtopic121>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic121]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic121);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
