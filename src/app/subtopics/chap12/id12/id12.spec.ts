import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Id12 } from './id12';

describe('Id12', () => {
  let component: Id12;
  let fixture: ComponentFixture<Id12>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id12]
    }).compileComponents();

    fixture = TestBed.createComponent(Id12);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});