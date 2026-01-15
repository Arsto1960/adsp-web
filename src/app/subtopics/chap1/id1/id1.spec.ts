import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id1 } from './id1';

describe('Id1', () => {
  let component: Id1;
  let fixture: ComponentFixture<Id1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
