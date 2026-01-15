import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id4 } from './id4';

describe('Id4', () => {
  let component: Id4;
  let fixture: ComponentFixture<Id4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
