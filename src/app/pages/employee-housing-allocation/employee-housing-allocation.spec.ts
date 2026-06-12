import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHousingAllocation } from './employee-housing-allocation';

describe('EmployeeHousingAllocation', () => {
  let component: EmployeeHousingAllocation;
  let fixture: ComponentFixture<EmployeeHousingAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeHousingAllocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeHousingAllocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
