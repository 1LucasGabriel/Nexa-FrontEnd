import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVehicleAllocationPage } from './employee-vehicle-allocation-page';

describe('EmployeeVehicleAllocationPage', () => {
  let component: EmployeeVehicleAllocationPage;
  let fixture: ComponentFixture<EmployeeVehicleAllocationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeVehicleAllocationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeVehicleAllocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
