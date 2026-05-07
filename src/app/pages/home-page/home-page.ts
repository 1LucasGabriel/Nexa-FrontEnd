import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { HomePageService } from '../../services/home-page-service';
import { MessageService } from 'primeng/api';
import { GetHomePageDTO } from '../../dtos/get-home-page-dto';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [SideMenu, ProgressBarModule, CommonModule],
  providers: [MessageService, DatePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private homePageService = inject(HomePageService);
  private messageService = inject(MessageService);
  public homePageData: GetHomePageDTO | null = null;

  ngOnInit() {
    this.getHomePageData();
  }

  public getHomePageData() {
    this.homePageService.get().subscribe({
      next: (value) => {
        this.homePageData = value;
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados da página inicial. Tente novamente'})
      }
    });
  }
// }
  public recentActivities = [
    { type: 'alert',   icon: 'pi pi-exclamation-triangle', title: 'Alojamento Central atingiu 100% da capacidade', description: 'Capacidade máxima atingida', time: '09:32' },
    { type: 'vehicle', icon: 'pi pi-car',                  title: 'Veículo KDYJ-3J2 sem motorista disponível',    description: 'Necessário alocação',       time: '09:15' },
    { type: 'person',  icon: 'pi pi-user',                 title: 'João Silva foi vinculado ao veículo LWUW-7M3', description: 'Vinculação por Maria Santos', time: '08:47' },
    { type: 'check',   icon: 'pi pi-check-circle',         title: 'Check-in realizado no Alojamento Norte',      description: '32 trabalhadores registrados', time: '08:30' },
    { type: 'travel',  icon: 'pi pi-map-marker',           title: 'Nova viagem iniciada',                        description: 'Rota: Alojamento Sul → Obra 03', time: '08:12' },
  ];

  public smartAlerts = [
    { severity: 'critical', icon: 'pi pi-exclamation-triangle', title: 'Alojamento Sul está com capacidade máxima', description: '100 / 100 ocupados', time: '09:32' },
    { severity: 'warning',  icon: 'pi pi-wrench',               title: '3 veículos precisam de manutenção',        description: 'Verifique a programação',  time: '09:10' },
    { severity: 'warning',  icon: 'pi pi-sign-out',             title: 'Check-out pendente de 12 trabalhadores',   description: 'Ações necessárias',        time: '08:55' },
  ];
}