import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id7 } from './id7';

describe('Id7', () => {
  let component: Id7;
  let fixture: ComponentFixture<Id7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
