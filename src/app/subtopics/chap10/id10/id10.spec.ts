import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Id10 } from './id10';

describe('Id10', () => {
  let component: Id10;
  let fixture: ComponentFixture<Id10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id10]
    }).compileComponents();

    fixture = TestBed.createComponent(Id10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});