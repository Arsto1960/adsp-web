import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id8 } from './id8';

describe('Id8', () => {
  let component: Id8;
  let fixture: ComponentFixture<Id8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
