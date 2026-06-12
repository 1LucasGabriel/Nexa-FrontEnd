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
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fleet-management-page',
  imports: [
    SideMenu,
    DynamicButton,
    DynamicSearchBar,
    DynamicTable,
    DynamicModal,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
  ],
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

  // ─── Estado de Modelo de Veículo ──────────────────────────
  isModelModalOpen = false;
  vehicleModels: any[] = [];
  loadingModels = false;
  newModel = {
    manufacturer: '',
    model: '',
    type: 3,
    year: new Date().getFullYear(),
    fuelType: 4,
    maxCapacity: 5
  };

  vehicleTypes = [
    { label: 'Caminhão', value: 1 },
    { label: 'Van', value: 2 },
    { label: 'Carro', value: 3 },
    { label: 'Pickup', value: 4 }
  ];

  fuelTypes = [
    { label: 'Diesel', value: 1 },
    { label: 'Gasolina', value: 2 },
    { label: 'Álcool/Etanol', value: 3 },
    { label: 'Flex', value: 4 }
  ];

  ngAfterViewInit() {
    this.getVehicles();
    this.loadVehicleModels();
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

  modelColumns: TableColumn[] = [
    { fieldAPI: 'id',           header: 'ID',         width: '80px'  },
    { fieldAPI: 'manufacturer', header: 'Fabricante', width: '150px' },
    { fieldAPI: 'model',        header: 'Modelo',     width: '150px' },
    { fieldAPI: 'maxCapacity',  header: 'Capacidade', width: '120px' }
  ];

  modelActions: TableAction[] = [
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-text p-button-sm p-button-danger' }
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
      { key: 'vehicleModelId', label: 'Modelo', type: ModalFieldType.Select, width: '30%', options: [] },
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
      1: 'Caminhão',
      2: 'Van',
      3: 'Carro',
      4: 'Pickup',
    };
    return type !== undefined ? types[type] ?? '-' : '-';
  }

  public handleModelAction(event: { action: string; item: any }) {
    if (event.action === 'delete') {
      this.deleteVehicleModel(event.item.id);
    }
  }

  // ─── Gerenciamento de Modelos de Veículo ──────────────────
  public openModelModal() {
    this.isModelModalOpen = true;
    this.loadVehicleModels();
  }

  public loadVehicleModels() {
    this.loadingModels = true;
    this.vehicleService.getVehicleModels().subscribe({
      next: (data) => {
        this.vehicleModels = data;

        // Atualiza as opções do dropdown dinâmico no config do modal
        const modelField = this.config.fields.find(f => f.key === 'vehicleModelId');
        if (modelField) {
          modelField.options = this.vehicleModels.map(m => ({
            label: `${m.manufacturer || ''} ${m.model || ''} (${m.year || ''})`,
            value: m.id
          }));
        }

        this.loadingModels = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar modelos de veículo.' });
        this.loadingModels = false;
      }
    });
  }

  public createVehicleModel() {
    if (!this.newModel.manufacturer || !this.newModel.model || !this.newModel.year || !this.newModel.maxCapacity) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, preencha os campos obrigatórios (Fabricante, Modelo, Ano, Capacidade).' });
      return;
    }

    const payload = {
      manufacturer: this.newModel.manufacturer,
      model: this.newModel.model,
      type: Number(this.newModel.type),
      year: Number(this.newModel.year),
      fuelType: Number(this.newModel.fuelType),
      maxCapacity: Number(this.newModel.maxCapacity)
    };

    this.vehicleService.postVehicleModel(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Modelo de veículo cadastrado com sucesso!' });
        this.newModel = {
          manufacturer: '',
          model: '',
          type: 3,
          year: new Date().getFullYear(),
          fuelType: 4,
          maxCapacity: 5
        };
        this.loadVehicleModels();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar modelo de veículo.' });
      }
    });
  }

  public deleteVehicleModel(id: number) {
    this.vehicleService.deleteVehicleModel(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Modelo excluído com sucesso!' });
        this.loadVehicleModels();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir modelo de veículo.' });
      }
    });
  }
}
