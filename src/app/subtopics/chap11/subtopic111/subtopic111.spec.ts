import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic111 } from './subtopic111';

describe('Subtopic111', () => {
  let component: Subtopic111;
  let fixture: ComponentFixture<Subtopic111>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic111]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic111);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
