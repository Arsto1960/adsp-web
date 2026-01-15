import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id6 } from './id6';

describe('Id6', () => {
  let component: Id6;
  let fixture: ComponentFixture<Id6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
