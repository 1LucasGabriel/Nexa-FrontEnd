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
  date: string;
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

  public statusMap: { [key: number]: { label: string; icon: string; color: string; bgColor: string; badgeBg: string } } = {
    0: { label: 'Transferido', icon: 'pi pi-home', color: '#818cf8', bgColor: 'rgba(129, 140, 248, 0.15)', badgeBg: 'rgba(129, 140, 248, 0.2)' },
    1: { label: 'Entrada', icon: 'pi pi-sign-in', color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', badgeBg: 'rgba(167, 139, 250, 0.2)' },
    2: { label: 'Saída', icon: 'pi pi-sign-out', color: '#f472b6', bgColor: 'rgba(244, 114, 182, 0.15)', badgeBg: 'rgba(244, 114, 182, 0.2)' },
    3: { label: 'De Férias', icon: 'pi pi-user', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.15)', badgeBg: 'rgba(251, 191, 36, 0.2)' },
    4: { label: 'Em andamento', icon: 'pi pi-car', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)', badgeBg: 'rgba(52, 211, 153, 0.2)' },
    5: { label: 'Concluída', icon: 'pi pi-car', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)', badgeBg: 'rgba(248, 113, 113, 0.2)' }
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

  public getMovements() {
    this.loading = true;
    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.originalMovements = data;
        this.filteredMovements = [...data];
        this.calculateCounters();
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

  private calculateCounters() {
    this.counters[0].value = this.originalMovements.filter(m => m.type === 0).length;
    this.counters[1].value = this.originalMovements.filter(m => m.type === 1).length;
    this.counters[2].value = this.originalMovements.filter(m => m.type === 2).length;
    this.counters[3].value = this.originalMovements.filter(m => m.type === 3).length;
    this.counters[4].value = this.originalMovements.filter(m => m.type === 4 || m.type === 5).length;
  }

  public searchTerm = '';
  public filterType: string = '';

  public onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  public onFilterChange(event: Event) {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  private applyFilters() {
    const lower = this.searchTerm.toLowerCase();
    this.filteredMovements = this.originalMovements.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
      const matchesType = this.filterType === '' || item.type === +this.filterType || (this.filterType === '4' && item.type === 5);
      return matchesSearch && matchesType;
    });
  }
}
