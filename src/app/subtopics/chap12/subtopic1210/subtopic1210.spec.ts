import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic1210 } from './subtopic1210';

describe('Subtopic1210', () => {
  let component: Subtopic1210;
  let fixture: ComponentFixture<Subtopic1210>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic1210]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic1210);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
