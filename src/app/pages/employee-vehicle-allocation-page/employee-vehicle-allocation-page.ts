import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { MapCard } from "../../components/map-card/map-card";
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employee-vehicle-allocation-page',
  imports: [CommonModule, SideMenu, MapCard, ChipModule, ProgressBarModule, AvatarModule, InputTextModule],
  providers: [ConfirmationService],
  templateUrl: './employee-vehicle-allocation-page.html',
  styleUrl: './employee-vehicle-allocation-page.scss',
})
export class EmployeeVehicleAllocationPage {
  public textButton: string = "+ Novo Veículo";
  public widthButton: string = "100%";

  // Mock Data
  public vehicles = [
    { id: 1, plate: 'LWUW-7M3', model: 'SPRINTER', capacity: 12, occupied: 3, status: 'available' },
    { id: 2, plate: 'KYDJ-3J2', model: 'POLO', capacity: 10, occupied: 9, status: 'unavailable' },
    { id: 3, plate: 'PXQF-2L8', model: 'HR-V', capacity: 8, occupied: 5, status: 'unavailable' },
    { id: 4, plate: 'RHTG-9P1', model: 'ONIX', capacity: 5, occupied: 2, status: 'unavailable' },
    { id: 5, plate: 'QWEE-8K7', model: 'TORO', capacity: 7, occupied: 0, status: 'unavailable' }
  ];

  public employeesInVehicle = [
    { id: 1, initials: 'AC', name: 'Aryane Caroline da S. de Souza', cpf: '488.126.209-04' },
    { id: 2, initials: 'JN', name: 'Joao Neto', cpf: '096.160.220-00' },
    { id: 3, initials: 'SD', name: 'Sofia Pereira Deniz', cpf: '388.226.689-04' }
  ];

  public selectedVehicle = this.vehicles[0];

  // Map coordinates (mock origin/dest to show something if needed, or null)
  public origin: [number, number] = [-23.5505, -46.6333]; // Sao Paulo
  public destination: [number, number] = [-22.9068, -43.1729]; // Rio de Janeiro

  selectVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
  }
}
