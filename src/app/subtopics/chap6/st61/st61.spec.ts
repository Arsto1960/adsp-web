import { ComponentFixture, TestBed } from '@angular/core/testing';

import { St61 } from './st61';

describe('St61', () => {
  let component: St61;
  let fixture: ComponentFixture<St61>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [St61]
    })
    .compileComponents();

    fixture = TestBed.createComponent(St61);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
