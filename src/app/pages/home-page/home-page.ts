import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { HomePageService } from '../../services/home-page-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetHomePageDTO } from '../../dtos/get-home-page-dto';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AlertSeverity } from '../../enums/alert';

@Component({
  selector: 'app-home-page',
  imports: [SideMenu, ProgressBarModule, CommonModule, ConfirmDialogModule, ToastModule],
  providers: [MessageService, DatePipe, ConfirmationService],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private homePageService = inject(HomePageService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  
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

  public getSeverityClass(severity: AlertSeverity): string {
    return severity === AlertSeverity.Critical ? 'critical' : 'warning';
  }

  public getSeverityIcon(severity: AlertSeverity): string {
    return severity === AlertSeverity.Critical ? 'pi pi-exclamation-triangle' : 'pi pi-exclamation-circle';
  }

  public irPara(rota: string) {
    this.router.navigate([`/${rota}`]);
  }

  public warning() {
    this.confirmationService.confirm({
      message: 'Esta funcionalidade ainda não está disponível. Em breve teremos novidades!',
      header: 'Em Desenvolvimento',
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