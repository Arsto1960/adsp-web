import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic13 } from './subtopic1.3';

describe('Subtopic13', () => {
  let component: Subtopic13;
  let fixture: ComponentFixture<Subtopic13>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic13]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic13);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
