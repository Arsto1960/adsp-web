import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic103 } from './subtopic103';

describe('Subtopic103', () => {
  let component: Subtopic103;
  let fixture: ComponentFixture<Subtopic103>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic103]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic103);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
