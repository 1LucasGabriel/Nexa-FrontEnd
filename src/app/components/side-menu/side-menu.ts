import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-side-menu',
  imports: [MenuModule, AvatarModule, BadgeModule],
  providers: [MessageService],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit {
  @Input() userName: string = '';
  @Input() userRole: string = '';

  // private messageService = inject(MessageService);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: '',
        items: [
          { label: 'Dashboards', icon: PrimeIcons.OBJECTS_COLUMN, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Funcionários', icon: PrimeIcons.USERS, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Alojamento', icon: PrimeIcons.HOME, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Veículos', icon: PrimeIcons.CAR, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Relatórios', icon: PrimeIcons.CLIPBOARD, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Movimentações', icon: PrimeIcons.REPLY, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },

          { label: 'Ajustes', icon: PrimeIcons.COG, iconStyle: { color: 'white' }, command: () => { this.irPara('') } },
        ]
      },
    ];
  }

  public irPara(rota: string) {
    console.log("FUTURAMENTE IRÁ NAVEGAR PARA:", rota);
  }

  public sair() {
    console.log("FUTURAMENTE IRA DESLOGAR O USUÁRIO")
  }
}
