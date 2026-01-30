import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Id9 } from './id9';

describe('Id9', () => {
  let component: Id9;
  let fixture: ComponentFixture<Id9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id9]
    }).compileComponents();

    fixture = TestBed.createComponent(Id9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});