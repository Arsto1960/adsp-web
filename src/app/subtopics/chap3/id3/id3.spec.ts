import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id3 } from './id3';

describe('Id3', () => {
  let component: Id3;
  let fixture: ComponentFixture<Id3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
