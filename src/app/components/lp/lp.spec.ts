import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lp } from './lp';

describe('Lp', () => {
  let component: Lp;
  let fixture: ComponentFixture<Lp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
