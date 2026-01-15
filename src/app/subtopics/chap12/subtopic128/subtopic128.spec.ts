import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic128 } from './subtopic128';

describe('Subtopic128', () => {
  let component: Subtopic128;
  let fixture: ComponentFixture<Subtopic128>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic128]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic128);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
