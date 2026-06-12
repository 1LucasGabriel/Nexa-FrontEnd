import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenu } from "../../components/side-menu/side-menu";
import { MapCard } from "../../components/map-card/map-card";
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DynamicModal, ModalConfig, ModalFieldType } from '../../components/dynamic-modal/dynamic-modal';

// ============================================================================================
// DADOS MOCK — Simulação completa sem dependência de API
// ============================================================================================

interface MockVehicle {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  occupied: number;
  status: number; // 1 = InUse, 2 = Available
  mileage: number;
  vehicleCondition: number;
  originCountry: string;
  vehicleModelId: number;
}

interface MockEmployee {
  id: number;
  userId: number;
  name: string;
  cpf: string;
  role: string;
  status: number; // 1 = Active
}

interface MockDriver {
  id: number;
  userId: number;
  name: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiration: string;
}

interface MockAddress {
  id: number;
  name: string;
  street: string;
  number: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface MockTrip {
  id: number;
  vehicleId: number;
  driverId: number;
  originAddressId: number;
  destinationAddressId: number;
  startDate: string;
  endDate: string | null;
  status: number; // 0 = InProgress, 1 = Completed
  description: string;
  employees: { linkId: number; employeeId: number }[];
}

const MOCK_VEHICLES: MockVehicle[] = [
  { id: 1, plate: 'ABC-1234', model: 'Sprinter 415', capacity: 15, occupied: 0, status: 2, mileage: 45200, vehicleCondition: 1, originCountry: 'BR', vehicleModelId: 1 },
  { id: 2, plate: 'DEF-5678', model: 'Master L3H2', capacity: 12, occupied: 0, status: 2, mileage: 32100, vehicleCondition: 1, originCountry: 'BR', vehicleModelId: 2 },
  { id: 3, plate: 'GHI-9012', model: 'Daily 35S14', capacity: 18, occupied: 0, status: 2, mileage: 58700, vehicleCondition: 2, originCountry: 'BR', vehicleModelId: 3 },
  { id: 4, plate: 'JKL-3456', model: 'Ducato Minibus', capacity: 16, occupied: 0, status: 2, mileage: 27500, vehicleCondition: 1, originCountry: 'BR', vehicleModelId: 4 },
  { id: 5, plate: 'MNO-7890', model: 'Volare V8L', capacity: 25, occupied: 0, status: 2, mileage: 89100, vehicleCondition: 1, originCountry: 'BR', vehicleModelId: 5 },
  { id: 6, plate: 'PQR-2345', model: 'Transit 350', capacity: 14, occupied: 0, status: 2, mileage: 15800, vehicleCondition: 1, originCountry: 'BR', vehicleModelId: 6 },
];

const MOCK_EMPLOYEES: MockEmployee[] = [
  { id: 1, userId: 10, name: 'Carlos Eduardo Silva', cpf: '123.456.789-00', role: 'Operador', status: 1 },
  { id: 2, userId: 11, name: 'Ana Paula Oliveira', cpf: '234.567.890-11', role: 'Técnica', status: 1 },
  { id: 3, userId: 12, name: 'Roberto Santos Lima', cpf: '345.678.901-22', role: 'Engenheiro', status: 1 },
  { id: 4, userId: 13, name: 'Fernanda Costa', cpf: '456.789.012-33', role: 'Supervisora', status: 1 },
  { id: 5, userId: 14, name: 'João Pedro Almeida', cpf: '567.890.123-44', role: 'Operador', status: 1 },
  { id: 6, userId: 15, name: 'Mariana Rodrigues', cpf: '678.901.234-55', role: 'Analista', status: 1 },
  { id: 7, userId: 16, name: 'Pedro Henrique Souza', cpf: '789.012.345-66', role: 'Técnico', status: 1 },
  { id: 8, userId: 17, name: 'Juliana Ferreira', cpf: '890.123.456-77', role: 'Operadora', status: 1 },
  { id: 9, userId: 18, name: 'Lucas Gabriel Santos', cpf: '901.234.567-88', role: 'Auxiliar', status: 1 },
  { id: 10, userId: 19, name: 'Beatriz Mendes', cpf: '012.345.678-99', role: 'Técnica', status: 1 },
];

const MOCK_DRIVERS: MockDriver[] = [
  { id: 1, userId: 20, name: 'José Ricardo Pereira', licenseNumber: '12345678900', licenseType: 'D', licenseExpiration: '2028-12-15' },
  { id: 2, userId: 21, name: 'Marcos Antonio Oliveira', licenseNumber: '98765432100', licenseType: 'D', licenseExpiration: '2027-08-20' },
  { id: 3, userId: 22, name: 'Wagner Luis Costa', licenseNumber: '45678912300', licenseType: 'C', licenseExpiration: '2029-03-10' },
];

const MOCK_ADDRESSES: MockAddress[] = [
  { id: 1, name: 'Base Operacional', street: 'Avenida Paulista', number: '1578', city: 'São Paulo', state: 'SP', lat: -23.5629, lng: -46.6544 },
  { id: 2, name: 'Canteiro de Obras A', street: 'Rua Augusta', number: '500', city: 'São Paulo', state: 'SP', lat: -23.5535, lng: -46.6575 },
  { id: 3, name: 'Alojamento Central', street: 'Rua da Consolação', number: '2200', city: 'São Paulo', state: 'SP', lat: -23.5534, lng: -46.6624 },
  { id: 4, name: 'Depósito Norte', street: 'Avenida Cruzeiro do Sul', number: '1800', city: 'São Paulo', state: 'SP', lat: -23.5072, lng: -46.6266 },
  { id: 5, name: 'Escritório Regional', street: 'Rua Oscar Freire', number: '900', city: 'São Paulo', state: 'SP', lat: -23.5621, lng: -46.6698 },
  { id: 6, name: 'Canteiro de Obras B', street: 'Avenida Brigadeiro Faria Lima', number: '3000', city: 'São Paulo', state: 'SP', lat: -23.5857, lng: -46.6820 },
];

// ============================================================================================

@Component({
  selector: 'app-employee-vehicle-allocation-page',
  standalone: true,
  imports: [
    CommonModule,
    SideMenu,
    MapCard,
    ChipModule,
    ProgressBarModule,
    AvatarModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DynamicModal,
    FormsModule,
    SelectModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './employee-vehicle-allocation-page.html',
  styleUrl: './employee-vehicle-allocation-page.scss',
})
export class EmployeeVehicleAllocationPage implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  public textButton: string = "+ Novo Veículo";
  public widthButton: string = "100%";

  public vehicles: MockVehicle[] = [];
  public selectedVehicle: MockVehicle | null = null;
  public employeesInVehicle: Array<{ id: number; linkId: number; initials: string; name: string; cpf: string }> = [];
  public lastTrip: MockTrip | null = null;

  public origin?: [number, number];
  public destination?: [number, number];

  public loadingVehicles = false;
  public loadingTrip = false;

  // Seleção de rotas
  public selectedOriginAddressId: number | null = null;
  public selectedDestinationAddressId: number | null = null;
  public addressOptions: any[] = [];
  public routeSelectedManually = false;

  // Estado interno da simulação
  private mockTrips: MockTrip[] = [];
  private mockDrivers: MockDriver[] = [...MOCK_DRIVERS];
  private nextTripId = 1;
  private nextLinkId = 1;

  // Modal de Viagem
  public isTripModalOpen = false;
  public tripModalConfig: ModalConfig = {
    title: 'Iniciar Nova Viagem',
    width: '500px',
    fields: [
      {
        key: 'driverId',
        label: 'Motorista',
        type: ModalFieldType.Select,
        required: true,
        options: []
      },
      {
        key: 'description',
        label: 'Descrição da Viagem',
        type: ModalFieldType.Textarea,
        required: false,
        placeholder: 'Insira observações ou rota'
      }
    ]
  };

  // Modal de Funcionário
  public isEmployeeModalOpen = false;
  public employeeModalConfig: ModalConfig = {
    title: 'Adicionar Funcionário ao Veículo',
    width: '500px',
    fields: [
      {
        key: 'employeeId',
        label: 'Funcionário',
        type: ModalFieldType.Select,
        required: true,
        options: []
      }
    ]
  };

  // Modal de Cadastro de Motorista
  public isDriverModalOpen = false;
  public driverModalConfig: ModalConfig = {
    title: 'Cadastrar como Motorista',
    width: '500px',
    fields: [
      {
        key: 'licenseNumber',
        label: 'Número da CNH',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Insira o número da sua CNH'
      },
      {
        key: 'licenseType',
        label: 'Categoria da CNH',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Ex: B, C, D'
      },
      {
        key: 'licenseExpiration',
        label: 'Vencimento da CNH',
        type: ModalFieldType.Date,
        required: true
      }
    ]
  };

  ngOnInit() {
    this.loadVehicles();
    this.loadAddresses();
  }

  // ============================================================================================
  // CARREGAMENTO DE DADOS (MOCK)
  // ============================================================================================

  public loadAddresses() {
    this.addressOptions = MOCK_ADDRESSES.map(a => ({
      label: `${a.name} - ${a.street}, ${a.number} (${a.city})`,
      value: a.id,
      lat: a.lat,
      lng: a.lng
    }));
  }

  public loadVehicles(preserveSelectedId?: number) {
    this.loadingVehicles = true;

    // Simula delay de rede (300ms)
    setTimeout(() => {
      this.vehicles = MOCK_VEHICLES.map(v => ({ ...v }));

      // Sincroniza occupied/status com trips ativas
      this.mockTrips.filter(t => !t.endDate).forEach(trip => {
        const veh = this.vehicles.find(v => v.id === trip.vehicleId);
        if (veh) {
          veh.status = 1;
          veh.occupied = trip.employees.length;
        }
      });

      if (this.vehicles.length > 0) {
        let selected = this.vehicles[0];
        if (preserveSelectedId) {
          const found = this.vehicles.find(v => v.id === preserveSelectedId);
          if (found) selected = found;
        } else if (this.selectedVehicle) {
          const found = this.vehicles.find(v => v.id === this.selectedVehicle!.id);
          if (found) selected = found;
        }
        this.selectVehicle(selected);
      } else {
        this.selectedVehicle = null;
      }
      this.loadingVehicles = false;
    }, 300);
  }

  public selectVehicle(vehicle: MockVehicle) {
    this.selectedVehicle = vehicle;
    this.loadLastTrip(vehicle.id);
  }

  public loadLastTrip(vehicleId: number) {
    this.loadingTrip = true;

    setTimeout(() => {
      // Encontra a última viagem ativa (sem endDate) para este veículo
      const activeTrip = this.mockTrips.find(t => t.vehicleId === vehicleId && !t.endDate);

      if (activeTrip) {
        this.lastTrip = activeTrip;
        this.routeSelectedManually = false;

        this.employeesInVehicle = activeTrip.employees.map(link => {
          const emp = MOCK_EMPLOYEES.find(e => e.id === link.employeeId)!;
          return {
            id: emp.id,
            linkId: link.linkId,
            initials: this.getInitials(emp.name),
            name: emp.name,
            cpf: emp.cpf
          };
        });

        const count = this.employeesInVehicle.length;
        this.selectedVehicle = { ...this.selectedVehicle!, occupied: count };

        const vehicleInList = this.vehicles.find(v => v.id === vehicleId);
        if (vehicleInList) vehicleInList.occupied = count;

        this.selectedOriginAddressId = activeTrip.originAddressId;
        this.selectedDestinationAddressId = activeTrip.destinationAddressId;

        this.setRouteFromAddressIds(activeTrip.originAddressId, activeTrip.destinationAddressId);
      } else {
        this.lastTrip = null;
        this.employeesInVehicle = [];
        if (!this.routeSelectedManually) {
          this.origin = undefined;
          this.destination = undefined;
          this.selectedOriginAddressId = null;
          this.selectedDestinationAddressId = null;
        }
        this.selectedVehicle = { ...this.selectedVehicle!, occupied: 0 };
        const vehicleInList = this.vehicles.find(v => v.id === vehicleId);
        if (vehicleInList) vehicleInList.occupied = 0;
      }
      this.loadingTrip = false;
    }, 200);
  }

  // ============================================================================================
  // COORDENADAS — usa coordenadas hardcoded nos mock addresses (zero APIs externas)
  // ============================================================================================

  public onAddressChange() {
    if (this.selectedOriginAddressId && this.selectedDestinationAddressId) {
      this.routeSelectedManually = true;
      this.setRouteFromAddressIds(this.selectedOriginAddressId, this.selectedDestinationAddressId);
    } else {
      this.routeSelectedManually = false;
      this.origin = undefined;
      this.destination = undefined;
    }
  }

  private setRouteFromAddressIds(originId: number, destinationId: number) {
    const originAddr = this.addressOptions.find(a => a.value === originId);
    const destAddr = this.addressOptions.find(a => a.value === destinationId);

    if (originAddr && destAddr) {
      this.origin = [originAddr.lat, originAddr.lng];
      this.destination = [destAddr.lat, destAddr.lng];
    } else {
      this.origin = undefined;
      this.destination = undefined;
    }
  }

  // ============================================================================================
  // AÇÕES DE VIAGEM (MOCK)
  // ============================================================================================

  public openTripModal() {
    if (!this.selectedOriginAddressId || !this.selectedDestinationAddressId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, selecione os endereços de Origem e Destino na tela principal antes de iniciar a viagem.'
      });
      return;
    }

    // Popula opções de motorista
    const driverOptions = this.mockDrivers.map(d => ({
      label: `${d.name} (${d.licenseType})`,
      value: d.id
    }));
    const drField = this.tripModalConfig.fields.find(f => f.key === 'driverId');
    if (drField) drField.options = driverOptions;

    this.isTripModalOpen = true;
  }

  public onConfirmTrip(formData: any) {
    if (!this.selectedVehicle) return;

    const newTrip: MockTrip = {
      id: this.nextTripId++,
      vehicleId: this.selectedVehicle.id,
      driverId: formData.driverId,
      originAddressId: this.selectedOriginAddressId!,
      destinationAddressId: this.selectedDestinationAddressId!,
      startDate: this.getLocalISOString(),
      endDate: null,
      status: 0, // InProgress
      description: formData.description || '',
      employees: []
    };

    this.mockTrips.push(newTrip);

    // Atualiza veículo para InUse
    const veh = MOCK_VEHICLES.find(v => v.id === this.selectedVehicle!.id);
    if (veh) veh.status = 1;

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Viagem iniciada com sucesso!'
    });

    this.loadVehicles(this.selectedVehicle.id);
  }

  public endJourney() {
    if (!this.lastTrip) {
      if (this.selectedVehicle?.status === 1) {
        this.confirmationService.confirm({
          message: 'Não encontramos nenhuma viagem ativa para este veículo, mas ele consta como "Em Uso". Deseja forçar a liberação do veículo para "Disponível"?',
          header: 'Forçar Liberação de Veículo',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Cancelar',
          rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
          acceptButtonProps: { label: 'Liberar Veículo', severity: 'warn' },
          accept: () => {
            const veh = MOCK_VEHICLES.find(v => v.id === this.selectedVehicle!.id);
            if (veh) veh.status = 2;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'O veículo foi liberado com sucesso!'
            });
            this.loadVehicles(this.selectedVehicle!.id);
          }
        });
      }
      return;
    }

    this.confirmationService.confirm({
      message: 'Você realmente deseja finalizar a viagem para este veículo?',
      header: 'Confirmar Encerramento',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Finalizar', severity: 'danger' },
      accept: () => {
        // Finaliza a viagem
        this.lastTrip!.endDate = this.getLocalISOString();
        this.lastTrip!.status = 1; // Completed

        // Libera o veículo
        const veh = MOCK_VEHICLES.find(v => v.id === this.selectedVehicle!.id);
        if (veh) {
          veh.status = 2;
          veh.occupied = 0;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Viagem finalizada com sucesso!'
        });

        this.loadVehicles(this.selectedVehicle!.id);
      }
    });
  }

  // ============================================================================================
  // AÇÕES DE FUNCIONÁRIOS (MOCK)
  // ============================================================================================

  public openEmployeeModal() {
    if (!this.selectedVehicle) return;
    if (!this.lastTrip) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Não há viagem ativa para este veículo. Inicie uma viagem primeiro.'
      });
      return;
    }
    if (this.selectedVehicle.occupied >= this.selectedVehicle.capacity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Capacidade máxima do veículo atingida.'
      });
      return;
    }

    // Encontra motorista ativo para filtrar
    const activeDriver = this.mockDrivers.find(d => d.id === this.lastTrip!.driverId);
    const driverUserId = activeDriver?.userId ?? null;

    const allocatedIds = this.employeesInVehicle.map(e => e.id);
    const availableEmps = MOCK_EMPLOYEES.filter(e =>
      e.status === 1 &&
      !allocatedIds.includes(e.id) &&
      e.userId !== driverUserId
    );

    const empOptions = availableEmps.map(e => ({
      label: `${e.name} (CPF: ${e.cpf})`,
      value: e.id
    }));

    const empField = this.employeeModalConfig.fields.find(f => f.key === 'employeeId');
    if (empField) empField.options = empOptions;

    this.isEmployeeModalOpen = true;
  }

  public onConfirmEmployee(formData: any) {
    if (!this.lastTrip || !this.selectedVehicle) return;

    const newLinkId = this.nextLinkId++;
    this.lastTrip.employees.push({
      linkId: newLinkId,
      employeeId: formData.employeeId
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Funcionário alocado com sucesso!'
    });

    this.loadLastTrip(this.selectedVehicle.id);
  }

  public removeEmployee(linkId: number) {
    this.confirmationService.confirm({
      message: 'Você realmente deseja remover este funcionário da viagem?',
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Remover', severity: 'danger' },
      accept: () => {
        if (this.lastTrip) {
          this.lastTrip.employees = this.lastTrip.employees.filter(e => e.linkId !== linkId);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Funcionário desvinculado com sucesso!'
        });

        this.loadLastTrip(this.selectedVehicle!.id);
      }
    });
  }

  // ============================================================================================
  // CADASTRO DE MOTORISTA (MOCK)
  // ============================================================================================

  public openRegisterDriverModal() {
    this.isDriverModalOpen = true;
  }

  public onConfirmRegisterDriver(formData: any) {
    const newDriver: MockDriver = {
      id: this.mockDrivers.length + 10,
      userId: 100 + this.mockDrivers.length,
      name: `Motorista ${formData.licenseNumber.slice(-4)}`,
      licenseNumber: formData.licenseNumber,
      licenseType: formData.licenseType,
      licenseExpiration: formData.licenseExpiration
        ? new Date(formData.licenseExpiration).toISOString()
        : new Date().toISOString()
    };

    this.mockDrivers.push(newDriver);

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Motorista cadastrado com sucesso!'
    });
  }

  // ============================================================================================
  // UTILITÁRIOS
  // ============================================================================================

  public getInitials(name: string | undefined): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  public irPara(rota: string) {
    this.router.navigate([`/${rota}`]);
  }

  private getLocalISOString(date: Date = new Date()): string {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
  }

  public warning() {
    this.confirmationService.confirm({
      message: 'A edição de rota para viagens em andamento não é permitida. Caso necessário, finalize esta viagem e inicie uma nova com a rota correta.',
      header: 'Ação não permitida',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Entendi',
      acceptButtonProps: {
        label: 'Entendi',
        severity: 'info'
      },
      rejectVisible: false,
      accept: () => { }
    });
  }
}
