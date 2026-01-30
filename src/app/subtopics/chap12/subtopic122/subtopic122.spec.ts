import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic122 } from './subtopic122';

describe('Subtopic122', () => {
  let component: Subtopic122;
  let fixture: ComponentFixture<Subtopic122>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic122]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic122);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
