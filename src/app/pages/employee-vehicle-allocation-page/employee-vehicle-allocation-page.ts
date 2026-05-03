import { Component } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-employee-vehicle-allocation-page',
  imports: [SideMenu, DynamicButton, ChipModule],
  templateUrl: './employee-vehicle-allocation-page.html',
  styleUrl: './employee-vehicle-allocation-page.scss',
})
export class EmployeeVehicleAllocationPage {
  public textButton: string = "+ Selecionar Veículo";
  public widthButton: string = "230px";

}
