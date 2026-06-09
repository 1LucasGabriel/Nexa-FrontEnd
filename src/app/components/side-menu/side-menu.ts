import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-side-menu',
  imports: [MenuModule, AvatarModule, BadgeModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit {
  private router = inject(Router)
  private authService = inject(AuthenticateService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)

  @Input() userName: string = '';
  @Input() userRole: string = '';

  items: MenuItem[] | undefined;
  isExpanded = false;

  ngOnInit() {
    this.items = [
      {
        label: '',
        items: [
          { label: 'Home', icon: PrimeIcons.HOME, iconStyle: { color: 'white' }, command: () => this.irPara('home') },
          { label: 'Alojamentos', icon: PrimeIcons.WAREHOUSE, iconStyle: { color: 'white' }, command: () => this.irPara('alojamentos') },
          { label: 'Alocação', icon: PrimeIcons.MAP, iconStyle: { color: 'white' }, command: () => this.irPara('employee-vehicle-allocation') },
          { label: 'Funcionários', icon: PrimeIcons.USERS, iconStyle: { color: 'white' }, command: () => this.irPara('employee-management') },
          { label: 'Veículos', icon: PrimeIcons.CAR, iconStyle: { color: 'white' }, command: () => this.irPara('fleet-management') },

          { label: 'Dashboard', icon: PrimeIcons.OBJECTS_COLUMN, iconStyle: { color: 'white' }, command: () => this.warning() },
          { label: 'Relatórios', icon: PrimeIcons.CLIPBOARD, iconStyle: { color: 'white' }, command: () => this.warning() },
          { label: 'Movimentações', icon: PrimeIcons.REPLY, iconStyle: { color: 'white' }, command: () => this.warning() },
          { label: 'Configurações', icon: PrimeIcons.COG, iconStyle: { color: 'white' }, command: () => this.warning() },
        ]
      }
    ];
  }

  public confirmLogout() {
    this.confirmationService.confirm({
      message: 'Você realmente deseja sair?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sair', severity: 'danger' },

      accept: () => {
        this.sair();
      }
    });
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

  public irPara(rota: string) {
    this.router.navigate([`/${rota}`]);
  }

  public sair() {
    this.authService.clear();
    this.router.navigate(['/login']);
  }
}
