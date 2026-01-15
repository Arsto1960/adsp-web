import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic71 } from './subtopic71';

describe('Subtopic71', () => {
  let component: Subtopic71;
  let fixture: ComponentFixture<Subtopic71>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic71]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic71);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
