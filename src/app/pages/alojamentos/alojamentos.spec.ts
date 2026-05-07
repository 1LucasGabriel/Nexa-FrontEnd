import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alojamento } from './alojamentos';

describe('Alojamento', () => {
  let component: Alojamento;
  let fixture: ComponentFixture<Alojamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alojamento],
    }).compileComponents();

    fixture = TestBed.createComponent(Alojamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});