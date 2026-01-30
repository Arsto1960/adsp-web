import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Id2 } from './id2';

describe('Id2', () => {
  let component: Id2;
  let fixture: ComponentFixture<Id2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Id2]
    }).compileComponents();

    fixture = TestBed.createComponent(Id2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});