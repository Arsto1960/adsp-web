import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id5 } from './id5';

describe('Id5', () => {
  let component: Id5;
  let fixture: ComponentFixture<Id5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
