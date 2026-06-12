import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenu } from '../../components/side-menu/side-menu';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { DynamicModal, ModalConfig, ModalFieldType } from '../../components/dynamic-modal/dynamic-modal';

import { HousingService } from '../../services/housing.service';
import { EmployeeService } from '../../services/employee-service';
import { Housing } from '../../models/housing';
import { Employee } from '../../models/employee';
import { HousingAllocation } from '../../models/housing-allocation';

// ============================================================================================
// DADOS MOCK — Fallback de Segurança caso a API falhe ou retorne vazio
// ============================================================================================
const MOCK_HOUSINGS: Housing[] = [
  { id: 1, name: 'Alojamento Sul', currentCapacity: 2, maxCapacity: 15, housingStatus: 1, housingType: 1, addressId: 1, useHousingRoom: true },
  { id: 2, name: 'Alojamento Central', currentCapacity: 1, maxCapacity: 12, housingStatus: 1, housingType: 2, addressId: 2, useHousingRoom: true },
  { id: 3, name: 'Alojamento Leste', currentCapacity: 0, maxCapacity: 8, housingStatus: 1, housingType: 3, addressId: 3, useHousingRoom: false },
  { id: 4, name: 'Alojamento Norte', currentCapacity: 0, maxCapacity: 10, housingStatus: 1, housingType: 1, addressId: 4, useHousingRoom: false }
];

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, userId: 10, name: 'Carlos Santos', cpf: '123.456.789-00', role: 'Operador', status: 1, phoneNumber: '', hireDate: new Date(), housingId: 1 },
  { id: 2, userId: 11, name: 'Ana Paula', cpf: '234.567.890-11', role: 'Técnica', status: 1, phoneNumber: '', hireDate: new Date(), housingId: 1 },
  { id: 3, userId: 12, name: 'Roberto Lima', cpf: '345.678.901-22', role: 'Engenheiro', status: 1, phoneNumber: '', hireDate: new Date(), housingId: 2 },
  { id: 4, userId: 13, name: 'Fernanda Costa', cpf: '456.789.012-33', role: 'Supervisora', status: 1, phoneNumber: '', hireDate: new Date(), housingId: 0 },
  { id: 5, userId: 14, name: 'João Pedro Almeida', cpf: '567.890.123-44', role: 'Operador', status: 1, phoneNumber: '', hireDate: new Date(), housingId: 0 }
];

const MOCK_ROOMS = [
  { id: 201, housingId: 1, number: '101', maxCapacity: 4, currentCapacity: 2 },
  { id: 202, housingId: 1, number: '102', maxCapacity: 4, currentCapacity: 0 },
  { id: 203, housingId: 2, number: '201', maxCapacity: 3, currentCapacity: 1 },
  { id: 204, housingId: 2, number: '202', maxCapacity: 3, currentCapacity: 0 },
];

const MOCK_ALLOCATIONS: { [key: number]: HousingAllocation[] } = {
  1: [
    { id: 101, employeeId: 1, employee: MOCK_EMPLOYEES[0], housingId: 1, checkInDate: '2026-06-01T08:00:00.000Z', housingRoomId: 201 },
    { id: 102, employeeId: 2, employee: MOCK_EMPLOYEES[1], housingId: 1, checkInDate: '2026-06-02T10:00:00.000Z', housingRoomId: 201 }
  ],
  2: [
    { id: 103, employeeId: 3, employee: MOCK_EMPLOYEES[2], housingId: 2, checkInDate: '2026-06-03T14:30:00.000Z', housingRoomId: 203 }
  ],
  3: [],
  4: []
};

@Component({
  selector: 'app-employee-housing-allocation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SideMenu,
    ChipModule,
    ProgressBarModule,
    AvatarModule,
    ToastModule,
    ConfirmDialogModule,
    DynamicModal
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './employee-housing-allocation.html',
  styleUrl: './employee-housing-allocation.scss',
})
export class EmployeeHousingAllocation implements OnInit {
  private housingService = inject(HousingService);
  private employeeService = inject(EmployeeService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // Estados principais
  public housings: Housing[] = [];
  public employees: Employee[] = [];
  public rooms: any[] = [];
  public selectedHousing: Housing | null = null;
  public currentAllocations: HousingAllocation[] = [];

  public loadingHousings = false;
  public loadingAllocations = false;
  public useMockFallback = false;

  // Modais e Configurações
  public isCheckInModalOpen = false;
  public checkInModalConfig: ModalConfig = {
    title: 'Hospedar Funcionário',
    width: '500px',
    fields: [
      {
        key: 'employeeId',
        label: 'Funcionário',
        type: ModalFieldType.Select,
        required: true,
        options: []
      },
      {
        key: 'checkInDate',
        label: 'Data de Entrada',
        type: ModalFieldType.Date,
        required: true,
        defaultValue: new Date()
      }
    ]
  };

  public isTransferModalOpen = false;
  public selectedAllocationForTransfer: HousingAllocation | null = null;
  public transferModalConfig: ModalConfig = {
    title: 'Transferir de Alojamento',
    width: '500px',
    fields: [
      {
        key: 'targetHousingId',
        label: 'Alojamento de Destino',
        type: ModalFieldType.Select,
        required: true,
        options: []
      }
    ]
  };

  // Estado dos dados mockados em memória para simulação
  private simHousings: Housing[] = [];
  private simEmployees: Employee[] = [];
  private simRooms: any[] = [];
  private simAllocations: { [key: number]: HousingAllocation[] } = {};
  private nextAllocationId = 1000;

  ngOnInit() {
    this.initSimulatedData();
    this.loadHousings();
    this.loadEmployees();
  }

  private initSimulatedData() {
    this.simHousings = JSON.parse(JSON.stringify(MOCK_HOUSINGS));
    this.simEmployees = JSON.parse(JSON.stringify(MOCK_EMPLOYEES));
    this.simRooms = JSON.parse(JSON.stringify(MOCK_ROOMS));
    this.simAllocations = JSON.parse(JSON.stringify(MOCK_ALLOCATIONS));
  }

  // ─── CARREGAMENTO DE DADOS ───────────────────────────────

  public loadRooms(): Promise<any[]> {
    return new Promise((resolve) => {
      if (this.useMockFallback) {
        this.rooms = this.simRooms;
        resolve(this.simRooms);
        return;
      }
      this.housingService.getHousingRooms().subscribe({
        next: (data) => {
          console.log('Housing rooms response:', data);
          if (!data || data.length === 0) {
            console.warn('API returned empty rooms list, falling back to mock rooms for testing.');
            this.rooms = this.simRooms;
          } else {
            this.rooms = (data || []).map(r => ({
              ...r,
              number: r.number || r.name || r.roomNumber || `Quarto ${r.id}`,
              maxCapacity: r.maxCapacity || r.capacity || 0,
              currentCapacity: r.currentCapacity || 0
            }));
          }
          resolve(this.rooms);
        },
        error: (err) => {
          console.warn('Error loading housing rooms from API, falling back to mock rooms:', err);
          this.rooms = this.simRooms;
          resolve(this.simRooms);
        }
      });
    });
  }

  public loadHousings(preserveSelectedId?: number) {
    this.loadingHousings = true;
    this.loadRooms().then(() => {
      this.housingService.getHousings().subscribe({
        next: (data) => {
          this.useMockFallback = false;
          if (!data || data.length === 0) {
            this.housings = this.simHousings;
            this.useMockFallback = true;
          } else {
            this.housings = data;
          }
          this.autoSelectHousing(preserveSelectedId);
          this.loadingHousings = false;
        },
        error: () => {
          this.useMockFallback = true;
          this.housings = this.simHousings;
          this.autoSelectHousing(preserveSelectedId);
          this.loadingHousings = false;
        }
      });
    });
  }

  private autoSelectHousing(preserveSelectedId?: number) {
    if (this.housings.length > 0) {
      let selected = this.housings[0];
      if (preserveSelectedId) {
        const found = this.housings.find(h => h.id === preserveSelectedId);
        if (found) selected = found;
      } else if (this.selectedHousing) {
        const found = this.housings.find(h => h.id === this.selectedHousing!.id);
        if (found) selected = found;
      }
      this.selectHousing(selected);
    } else {
      this.selectedHousing = null;
      this.currentAllocations = [];
    }
  }

  public loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.employees = this.simEmployees;
        } else {
          this.employees = data;
        }
      },
      error: () => {
        this.employees = this.simEmployees;
      }
    });
  }

  public selectHousing(housing: Housing) {
    this.selectedHousing = housing;
    this.loadAllocations(housing.id);
  }

  public loadAllocations(housingId: number) {
    this.loadingAllocations = true;
    if (this.useMockFallback) {
      setTimeout(() => {
        this.currentAllocations = this.simAllocations[housingId] || [];
        this.loadingAllocations = false;
      }, 150);
      return;
    }

    this.housingService.getHousingAllocations(housingId).subscribe({
      next: (data) => {
        // Filtra alocações ativas (sem data de checkout)
        this.currentAllocations = (data || []).filter(alloc => !alloc.checkOutDate);
        this.loadingAllocations = false;
      },
      error: () => {
        this.currentAllocations = this.simAllocations[housingId] || [];
        this.loadingAllocations = false;
      }
    });
  }

  // ─── AÇÕES: CHECK-IN (HOSPEDAR) ──────────────────────────

  public openCheckInModal() {
    if (!this.selectedHousing) return;

    if (this.selectedHousing.currentCapacity >= this.selectedHousing.maxCapacity) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Este alojamento já atingiu a capacidade máxima!'
      });
      return;
    }

    const availableEmployees = this.employees.filter(emp => emp.status === 1);

    const empOptions = availableEmployees.map(emp => ({
      label: `${emp.name} (${emp.role})`,
      value: emp.id
    }));

    const fields = [
      {
        key: 'employeeId',
        label: 'Funcionário',
        type: ModalFieldType.Select,
        required: true,
        options: empOptions
      },
      {
        key: 'checkInDate',
        label: 'Data de Entrada',
        type: ModalFieldType.Date,
        required: true,
        defaultValue: new Date()
      }
    ];

    if (this.selectedHousing.useHousingRoom) {
      const roomOptions = this.rooms
        .filter(r => Number(r.housingId) === Number(this.selectedHousing!.id) && (Number(r.currentCapacity) || 0) < Number(r.maxCapacity))
        .map(r => ({
          label: `Quarto ${r.number || r.name || r.roomNumber || r.id} (${r.currentCapacity || 0}/${r.maxCapacity} vagas)`,
          value: r.id
        }));

      if (roomOptions.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Não há quartos com vagas disponíveis neste alojamento!'
        });
        return;
      }

      fields.splice(1, 0, {
        key: 'housingRoomId',
        label: 'Quarto',
        type: ModalFieldType.Select,
        required: true,
        options: roomOptions
      });
    }

    this.checkInModalConfig = {
      ...this.checkInModalConfig,
      fields: fields
    };
    this.isCheckInModalOpen = true;
  }

  public onConfirmCheckIn(formData: any) {
    if (!this.selectedHousing) return;

    const payload: any = {
      employeeId: Number(formData.employeeId),
      housingId: this.selectedHousing.id,
      checkInDate: formData.checkInDate ? new Date(formData.checkInDate).toISOString() : new Date().toISOString()
    };

    if (this.selectedHousing.useHousingRoom && formData.housingRoomId) {
      payload.housingRoomId = Number(formData.housingRoomId);
    }

    if (this.useMockFallback) {
      // Simulação Local
      const emp = this.employees.find(e => e.id === payload.employeeId);
      const newAlloc: HousingAllocation = {
        id: this.nextAllocationId++,
        employeeId: payload.employeeId,
        employee: emp,
        housingId: payload.housingId,
        checkInDate: payload.checkInDate,
        housingRoomId: payload.housingRoomId
      };

      if (!this.simAllocations[payload.housingId]) this.simAllocations[payload.housingId] = [];
      this.simAllocations[payload.housingId].push(newAlloc);

      // Incrementa capacidade
      const h = this.simHousings.find(x => x.id === payload.housingId);
      if (h) h.currentCapacity = (h.currentCapacity || 0) + 1;

      // Incrementa capacidade do quarto
      if (payload.housingRoomId) {
        const r = this.simRooms.find(x => x.id === payload.housingRoomId);
        if (r) r.currentCapacity = (r.currentCapacity || 0) + 1;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Funcionário hospedado com sucesso (modo simulado)!'
      });
      this.loadHousings(this.selectedHousing.id);
      return;
    }

    this.housingService.postHousingAllocation(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Funcionário hospedado com sucesso!'
        });
        this.loadHousings(this.selectedHousing!.id);
      },
      error: (err) => {
        const msg = err.error?.detail || 'Não foi possível hospedar o funcionário no momento.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de Validação',
          detail: msg
        });
      }
    });
  }

  // ─── AÇÕES: CHECK-OUT (REGISTRAR SAÍDA) ───────────────────

  public checkOutEmployee(allocation: HousingAllocation) {
    this.confirmationService.confirm({
      message: `Deseja realmente registrar a saída de ${allocation.employee?.name} deste alojamento?`,
      header: 'Confirmar Saída',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Confirmar Saída', severity: 'danger' },
      accept: () => {
        this.executeCheckOut(allocation);
      }
    });
  }

  private executeCheckOut(allocation: HousingAllocation, isTransfer = false): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.useMockFallback) {
        // Simulação Local
        const list = this.simAllocations[allocation.housingId] || [];
        this.simAllocations[allocation.housingId] = list.filter(a => a.id !== allocation.id);

        // Decrementa capacidade
        const h = this.simHousings.find(x => x.id === allocation.housingId);
        if (h) h.currentCapacity = Math.max(0, (h.currentCapacity || 1) - 1);

        // Decrementa capacidade do quarto
        if (allocation.housingRoomId) {
          const r = this.simRooms.find(x => x.id === allocation.housingRoomId);
          if (r) r.currentCapacity = Math.max(0, (r.currentCapacity || 1) - 1);
        }

        if (!isTransfer) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Saída registrada com sucesso (modo simulado)!'
          });
          this.loadHousings(this.selectedHousing?.id);
        }
        resolve(true);
        return;
      }

      this.housingService.deleteHousingAllocation(allocation.id).subscribe({
        next: () => {
          if (!isTransfer) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Saída registrada com sucesso!'
            });
            this.loadHousings(this.selectedHousing?.id);
          }
          resolve(true);
        },
        error: () => {
          // Fallback tenta o PUT definindo data de check-out
          this.housingService.putHousingAllocation(allocation.id, { checkOutDate: new Date().toISOString() }).subscribe({
            next: () => {
              if (!isTransfer) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Saída registrada com sucesso!'
                });
                this.loadHousings(this.selectedHousing?.id);
              }
              resolve(true);
            },
            error: (err) => {
              const msg = err.error?.detail || 'Erro ao registrar saída do funcionário.';
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: msg
              });
              resolve(false);
            }
          });
        }
      });
    });
  }

  // ─── AÇÕES: TRANSFERÊNCIA DE ALOJAMENTO ───────────────────

  public openTransferModal(allocation: HousingAllocation) {
    this.selectedAllocationForTransfer = allocation;

    const options: any[] = [];

    // Loop em todos os alojamentos exceto o atual
    this.housings.forEach(h => {
      if (h.id === allocation.housingId) return;

      if (h.useHousingRoom) {
        // Busca quartos disponíveis no alojamento de destino
        const roomsInHousing = this.rooms.filter(r => Number(r.housingId) === Number(h.id) && (Number(r.currentCapacity) || 0) < Number(r.maxCapacity));
        roomsInHousing.forEach(r => {
          options.push({
            label: `${h.name} - Quarto ${r.number || r.name || r.roomNumber || r.id} (${r.currentCapacity || 0}/${r.maxCapacity} ocupados)`,
            value: `room_${r.id}`
          });
        });
      } else {
        if ((h.currentCapacity || 0) < h.maxCapacity) {
          options.push({
            label: `${h.name} (Sem quartos - ${h.currentCapacity || 0}/${h.maxCapacity} ocupados)`,
            value: `housing_${h.id}`
          });
        }
      }
    });

    this.transferModalConfig = {
      ...this.transferModalConfig,
      fields: this.transferModalConfig.fields.map(f => {
        if (f.key === 'targetHousingId') {
          return {
            ...f,
            options: options,
            label: 'Destino (Alojamento/Quarto)'
          };
        }
        return f;
      })
    };

    this.isTransferModalOpen = true;
  }

  public async onConfirmTransfer(formData: any) {
    if (!this.selectedAllocationForTransfer || !this.selectedHousing) return;

    const valueStr = String(formData.targetHousingId);
    let targetHousingId: number;
    let targetHousingRoomId: number | null = null;

    if (valueStr.startsWith('room_')) {
      targetHousingRoomId = Number(valueStr.replace('room_', ''));
      const r = this.rooms.find(x => x.id === targetHousingRoomId);
      if (!r) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Quarto de destino não encontrado.'
        });
        return;
      }
      targetHousingId = r.housingId;
    } else if (valueStr.startsWith('housing_')) {
      targetHousingId = Number(valueStr.replace('housing_', ''));
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Destino inválido.'
      });
      return;
    }

    const allocation = this.selectedAllocationForTransfer;
    const employeeId = allocation.employeeId;

    // 1. Executa o check-out do alojamento de origem
    const checkedOut = await this.executeCheckOut(allocation, true);

    if (checkedOut) {
      // 2. Executa o check-in no alojamento de destino
      const payload: any = {
        employeeId: employeeId,
        housingId: targetHousingId,
        checkInDate: new Date().toISOString()
      };

      if (targetHousingRoomId) {
        payload.housingRoomId = targetHousingRoomId;
      }

      if (this.useMockFallback) {
        // Simulação Local
        const emp = this.employees.find(e => e.id === employeeId);
        const newAlloc: HousingAllocation = {
          id: this.nextAllocationId++,
          employeeId: employeeId,
          employee: emp,
          housingId: targetHousingId,
          checkInDate: payload.checkInDate,
          housingRoomId: targetHousingRoomId
        };

        if (!this.simAllocations[targetHousingId]) this.simAllocations[targetHousingId] = [];
        this.simAllocations[targetHousingId].push(newAlloc);

        const h = this.simHousings.find(x => x.id === targetHousingId);
        if (h) h.currentCapacity = (h.currentCapacity || 0) + 1;

        if (targetHousingRoomId) {
          const r = this.simRooms.find(x => x.id === targetHousingRoomId);
          if (r) r.currentCapacity = (r.currentCapacity || 0) + 1;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Transferência realizada com sucesso!`
        });

        this.loadHousings(this.selectedHousing.id);
        return;
      }

      this.housingService.postHousingAllocation(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Funcionário transferido com sucesso!`
          });
          this.loadHousings(this.selectedHousing!.id);
        },
        error: (err) => {
          const msg = err.error?.detail || 'Saída registrada, mas falha ao inserir no novo alojamento.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro parcial',
            detail: msg
          });
          this.loadHousings(this.selectedHousing!.id);
        }
      });
    }
  }

  // ─── UTILITÁRIOS ──────────────────────────────────────────

  public getInitials(name: string | undefined): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  public getOccupancyPercent(housing: Housing): number {
    if (!housing.maxCapacity) return 0;
    return Math.round(((housing.currentCapacity || 0) / housing.maxCapacity) * 100);
  }

  public getProgressBarColor(percent: number): string {
    if (percent >= 90) return '#ef4444'; // Vermelho
    if (percent >= 75) return '#f97316'; // Laranja
    return '#3b82f6'; // Azul
  }

  public getHousingTypeLabel(type: number | undefined): string {
    if (type === 1) return 'Masculino';
    if (type === 2) return 'Feminino';
    return 'Misto';
  }

  public getHousingTypeColor(type: number | undefined): string {
    if (type === 1) return '#3b82f6';
    if (type === 2) return '#ec4899';
    return '#8b5cf6';
  }

  public irPara(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}
