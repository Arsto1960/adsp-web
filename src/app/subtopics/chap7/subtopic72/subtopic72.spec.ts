import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic72 } from './subtopic72';

describe('Subtopic72', () => {
  let component: Subtopic72;
  let fixture: ComponentFixture<Subtopic72>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic72]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic72);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
