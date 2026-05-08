import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';
import { DynamicTable, TableAction, TableColumn } from "../../components/dynamic-table/dynamic-table";
import { DynamicModal, ModalConfig, ModalFieldType } from "../../components/dynamic-modal/dynamic-modal";
import { VehicleService } from '../../services/vehicle-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VehicleStatus } from '../../enums/vehicle-status';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-fleet-management-page',
  imports: [SideMenu, DynamicButton, DynamicSearchBar, DynamicTable, DynamicModal, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './fleet-management-page.html',
  styleUrl: './fleet-management-page.scss',
})
export class FleetManagementPage {
  private messageService = inject(MessageService);
  private vehicleService = inject(VehicleService);
  private confirmationService = inject(ConfirmationService);
  public buttonText = 'Adicionar Veículo';
  isEditMode: boolean = false;
  selectedVehicle: any = null;
  totalRecords = 0;
  loading = false;
  rows = 10;
  originalData: any[] = [];
  filteredData: any[] = [];

  ngAfterViewInit() {
    this.getVehicles();
  }

  public getVehicles() {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        const mapped = vehicles.map(v => ({
          ...v,
          modelo: v.vehicleModel?.model ?? '-',
          fabricante: v.vehicleModel?.manufacturer ?? '-',
          tipo: this.getVehicleTypeLabel(v.vehicleModel?.type),
          placa: v.licensePlate,
          capacidade: v.vehicleModel?.maxCapacity ?? '-',
        }));
        this.originalData = mapped;
        this.filteredData = [...mapped];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar veículos. Tente novamente'});
        this.loading = false;
      }
    });
  }

  public createVehicle(data: any) {
    const body = {
      licensePlate: data.licensePlate,
      vehicleModelId: Number(data.vehicleModelId),
      chassisNumber: data.chassisNumber,
      mileage: Number(data.mileage),
      status: Number(data.status),
      vehicleCondition: Number(data.vehicleCondition),
      originCountry: data.originCountry,
    };

    this.vehicleService.postVehicle(body).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo criado com sucesso!'});
        this.getVehicles();
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao criar veículo. Tente novamente'});
      }
    });
  }

  public editVehicle(vehicle: any) {
    const body = {
      licensePlate: vehicle.licensePlate,
      mileage: Number(vehicle.mileage),
      status: Number(vehicle.status),
      vehicleCondition: Number(vehicle.vehicleCondition),
      originCountry: vehicle.originCountry,
    };

    this.vehicleService.putVehicle(vehicle.id, body).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo editado com sucesso!'});
        this.getVehicles();
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao editar veículo. Tente novamente'});
      }
    });
  }

  public confirmDelete(vehicle: any) {
    this.confirmationService.confirm({
      message: 'Você realmente deseja excluir este veículo?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Deletar', severity: 'danger' },
      accept: () => {
        this.deleteVehicle(vehicle);
      }
    });
  }

  public deleteVehicle(vehicle: any) {
    this.vehicleService.deleteVehicle(vehicle.id).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo excluído com sucesso!'});
        this.getVehicles();
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao excluir veículo. Tente novamente'});
      }
    });
  }

  // Configuração Tabela
  columns: TableColumn[] = [
    { fieldAPI: 'status', header: 'Status', type: 'status' },
    { fieldAPI: 'modelo', header: 'Modelo' },
    { fieldAPI: 'fabricante', header: 'Fabricante' },
    { fieldAPI: 'tipo', header: 'Tipo' },
    { fieldAPI: 'placa', header: 'Placa' },
    { fieldAPI: 'capacidade', header: 'Capacidade' },
  ];

  actions: TableAction[] = [
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-danger' },
  ];

  statusColorMap = {
    1: { color: '#3b82f6', label: 'Em Uso' },
    2: { color: '#22c55e', label: 'Disponível' },
  };

  public handleAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.item);
        break;
      case 'delete':
        this.confirmDelete(event.item);
        break;
    }
  }

  // Configuração Modal
  public isModalOpen: boolean = false;

  config: ModalConfig = {
    title: this.modalTitle,
    width: '800px',
    fields: [
      { key: 'licensePlate', label: 'Placa', type: ModalFieldType.Text, width: '30%' },
      { key: 'chassisNumber', label: 'Chassi', type: ModalFieldType.Text, width: '40%' },
      { key: 'mileage', label: 'Quilometragem', type: ModalFieldType.Text, width: '30%' },
      { key: 'vehicleModelId', label: 'ID Modelo', type: ModalFieldType.Text, width: '20%' },
      { key: 'originCountry', label: 'País de Origem', type: ModalFieldType.Text, width: '30%' },
      { key: 'status', label: 'Status', type: ModalFieldType.Select, width: '30%', options: [{ label: 'Disponível', value: VehicleStatus.Avaliable }, { label: 'Em Uso', value: VehicleStatus.InUse }] },
      { key: 'vehicleCondition', label: 'Condição', type: ModalFieldType.Select, width: '30%', options: [{ label: 'Novo', value: 1 }, { label: 'Usado', value: 2 }] },
    ]
  }

  get modalTitle() {
    return this.isEditMode ? 'Editar Veículo' : 'Adicionar Veículo';
  }

  public openAddModal() {
    this.isModalOpen = true;
  }

  public onConfirm(data: any) {
    if (this.isEditMode && this.selectedVehicle) {
      const updatedVehicle = { ...this.selectedVehicle, ...data };
      this.editVehicle(updatedVehicle);
    } else {
      this.createVehicle(data);
    }
  }

  public openEditModal(vehicle: any) {
    this.isEditMode = true;
    this.selectedVehicle = vehicle;
    this.isModalOpen = true;
  }

  public onModalVisibilityChange(value: boolean) {
    this.isModalOpen = value;
    if (!value) {
      this.isEditMode = false;
      this.selectedVehicle = null;
    }
  }

  // Configuração SearchBar
  onSearch(term: string) {
    const lower = term.toLowerCase();
    this.filteredData = this.originalData.filter(item =>
      Object.values(item).some(value => String(value).toLowerCase().includes(lower))
    );
  }

  // Helpers
  private getVehicleTypeLabel(type: number | undefined): string {
    const types: { [key: number]: string } = {
      0: 'Caminhão',
      1: 'Van',
      2: 'Carro',
      3: 'Pickup',
    };
    return type !== undefined ? types[type] ?? '-' : '-';
  }
}
