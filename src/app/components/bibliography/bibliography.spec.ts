import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bibliography } from './bibliography';

describe('Bibliography', () => {
  let component: Bibliography;
  let fixture: ComponentFixture<Bibliography>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bibliography]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bibliography);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
