import { ComponentFixture, TestBed } from '@angular/core/testing';

import { St63 } from './st63';

describe('St63', () => {
  let component: St63;
  let fixture: ComponentFixture<St63>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [St63]
    })
    .compileComponents();

    fixture = TestBed.createComponent(St63);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
