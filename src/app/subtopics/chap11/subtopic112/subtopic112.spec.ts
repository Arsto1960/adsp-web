import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic112 } from './subtopic112';

describe('Subtopic112', () => {
  let component: Subtopic112;
  let fixture: ComponentFixture<Subtopic112>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic112]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic112);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
