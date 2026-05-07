import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';
import { DynamicTable, TableAction, TableColumn } from "../../components/dynamic-table/dynamic-table";
import { DynamicModal, ModalConfig, ModalFieldType } from "../../components/dynamic-modal/dynamic-modal";
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
    this.originalData = [];
    this.filteredData = [];
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
        this.filteredData = this.filteredData.filter(v => v.id !== vehicle.id);
        this.originalData = this.originalData.filter(v => v.id !== vehicle.id);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo excluído com sucesso!'});
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
    0: { color: '#22c55e', label: 'Disponível' },
    1: { color: '#3b82f6', label: 'Em Uso' },
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
      { key: 'modelo', label: 'Modelo', type: ModalFieldType.Text, width: '40%' },
      { key: 'fabricante', label: 'Fabricante', type: ModalFieldType.Text, width: '40%' },
      { key: 'tipo', label: 'Tipo', type: ModalFieldType.Select, width: '30%', options: [{ label: 'Van', value: 'Van' }, { label: 'Pickup', value: 'Pickup' }, { label: 'Caminhão', value: 'Caminhão' }] },
      { key: 'placa', label: 'Placa', type: ModalFieldType.Text, width: '25%' },
      { key: 'capacidade', label: 'Capacidade', type: ModalFieldType.Text, width: '25%' },
      { key: 'status', label: 'Status', type: ModalFieldType.Select, width: '30%', options: [{ label: 'Disponível', value: VehicleStatus.Avaliable }, { label: 'Em Uso', value: VehicleStatus.InUse }] },
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
      const index = this.originalData.findIndex(v => v.id === this.selectedVehicle.id);
      if (index !== -1) {
        this.originalData[index] = { ...this.selectedVehicle, ...data };
        this.filteredData = [...this.originalData];
      }
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo editado com sucesso!'});
    } else {
      const newVehicle = { id: Date.now(), ...data };
      this.originalData.push(newVehicle);
      this.filteredData = [...this.originalData];
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veículo criado com sucesso!'});
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
}
