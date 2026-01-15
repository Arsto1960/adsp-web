import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic125 } from './subtopic125';

describe('Subtopic125', () => {
  let component: Subtopic125;
  let fixture: ComponentFixture<Subtopic125>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic125]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic125);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
