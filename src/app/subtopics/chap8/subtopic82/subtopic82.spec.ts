import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic82 } from './subtopic82';

describe('Subtopic82', () => {
  let component: Subtopic82;
  let fixture: ComponentFixture<Subtopic82>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic82]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic82);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
