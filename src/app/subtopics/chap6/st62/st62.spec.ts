import { ComponentFixture, TestBed } from '@angular/core/testing';

import { St62 } from './st62';

describe('St62', () => {
  let component: St62;
  let fixture: ComponentFixture<St62>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [St62]
    })
    .compileComponents();

    fixture = TestBed.createComponent(St62);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
