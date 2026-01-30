import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id83 } from './id83';

describe('Id83', () => {
  let component: Id83;
  let fixture: ComponentFixture<Id83>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id83]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id83);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
