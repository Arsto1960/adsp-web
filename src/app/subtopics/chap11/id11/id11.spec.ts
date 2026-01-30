import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Id11 } from './id11';

describe('Id11', () => {
  let component: Id11;
  let fixture: ComponentFixture<Id11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id11]
    }).compileComponents();

    fixture = TestBed.createComponent(Id11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});