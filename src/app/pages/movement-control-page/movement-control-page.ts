import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenu } from '../../components/side-menu/side-menu';
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';
import { MovementService } from '../../services/movement-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export interface MovementLog {
  id: number;
  type: number;
  title: string;
  description: string;
  createdAt: string;
  employeeId?: number | null;
  vehicleId?: number | null;
  housingId?: number | null;
  statusLabel?: string;
}

export interface MovementsResponse {
  housingTransfersCount: number;
  housingCheckInsCount: number;
  housingCheckOutsCount: number;
  statusChangesCount: number;
  vehicleTripsCount: number;
  items: MovementLog[];
  totalItems: number;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-movement-control-page',
  standalone: true,
  imports: [CommonModule, SideMenu, DynamicSearchBar, ToastModule],
  providers: [MessageService],
  templateUrl: './movement-control-page.html',
  styleUrl: './movement-control-page.scss'
})
export class MovementControlPage implements OnInit {
  private movementService = inject(MovementService);
  private messageService = inject(MessageService);

  public loading = false;
  public originalMovements: MovementLog[] = [];
  public filteredMovements: MovementLog[] = [];

  public page = 1;
  public pageSize = 10;
  public totalItems = 0;
  public totalPages = 0;
  public searchTerm = '';
  public filterType = '';

  public statusMap: { [key: number]: { label: string; icon: string; color: string; bgColor: string; badgeBg: string } } = {
    1: { label: 'Transferido', icon: 'pi pi-home', color: '#818cf8', bgColor: 'rgba(129, 140, 248, 0.15)', badgeBg: 'rgba(129, 140, 248, 0.2)' },
    2: { label: 'Entrada', icon: 'pi pi-sign-in', color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', badgeBg: 'rgba(167, 139, 250, 0.2)' },
    3: { label: 'Saída', icon: 'pi pi-sign-out', color: '#f472b6', bgColor: 'rgba(244, 114, 182, 0.15)', badgeBg: 'rgba(244, 114, 182, 0.2)' },
    4: { label: 'De Férias', icon: 'pi pi-user', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.15)', badgeBg: 'rgba(251, 191, 36, 0.2)' },
    5: { label: 'Em andamento', icon: 'pi pi-car', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)', badgeBg: 'rgba(52, 211, 153, 0.2)' },
    6: { label: 'Concluída', icon: 'pi pi-car', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)', badgeBg: 'rgba(248, 113, 113, 0.2)' }
  };

  public counters = [
    { title: 'Transferências de Alojamento', value: 0, icon: 'pi pi-home', color: '#818cf8', bgColor: 'rgba(129, 140, 248, 0.35)' },
    { title: 'Entrada de Alojamento', value: 0, icon: 'pi pi-home', color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.35)' },
    { title: 'Saída de Alojamento', value: 0, icon: 'pi pi-sign-out', color: '#f472b6', bgColor: 'rgba(244, 114, 182, 0.35)' },
    { title: 'Alteração de Status', value: 0, icon: 'pi pi-user', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.35)' },
    { title: 'Movimentação de Veículos', value: 0, icon: 'pi pi-car', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.35)' }
  ];

  ngOnInit() {
    this.getMovements();
  }

  public getSelectedTypes(): number[] {
    if (!this.filterType) return [];
    if (this.filterType === '1') return [1];
    if (this.filterType === '2') return [2];
    if (this.filterType === '3') return [3];
    if (this.filterType === '4') return [4];
    if (this.filterType === '5') return [5, 6];
    return [];
  }

  public getMovements() {
    this.loading = true;
    const types = this.getSelectedTypes();

    this.movementService.getMovements({
      search: this.searchTerm || undefined,
      types: types.length > 0 ? types : undefined,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe({
      next: (response) => {
        this.originalMovements = response.items;
        this.filteredMovements = [...response.items];
        this.totalItems = response.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.updateCounters(response);
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar o histórico de movimentações.'
        });
        this.loading = false;
      }
    });
  }

  private updateCounters(response: MovementsResponse) {
    this.counters[0].value = response.housingTransfersCount;
    this.counters[1].value = response.housingCheckInsCount;
    this.counters[2].value = response.housingCheckOutsCount;
    this.counters[3].value = response.statusChangesCount;
    this.counters[4].value = response.vehicleTripsCount;
  }

  public onSearch(term: string) {
    this.searchTerm = term;
    this.page = 1;
    this.getMovements();
  }

  public onFilterChange(event: Event) {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.page = 1;
    this.getMovements();
  }

  public changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.getMovements();
    }
  }
}
