import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pycodechap1 } from './pycodechap1';

describe('Pycodechap1', () => {
  let component: Pycodechap1;
  let fixture: ComponentFixture<Pycodechap1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pycodechap1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pycodechap1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
