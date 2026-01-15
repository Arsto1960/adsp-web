import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id82 } from './id82';

describe('Id82', () => {
  let component: Id82;
  let fixture: ComponentFixture<Id82>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id82]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id82);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
