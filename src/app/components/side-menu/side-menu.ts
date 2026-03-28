import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { MenuModule } from 'primeng/menu';


@Component({
  selector: 'app-side-menu',
  imports: [MenuModule],
  providers: [MessageService],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit {
 private messageService = inject(MessageService);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: '',
        
      },
      {
        label: '',
        items: [
          { label: 'Dashboards', icon: PrimeIcons.OBJECTS_COLUMN },
          { label: 'Funcionários', icon: PrimeIcons.USERS },
          { label: 'Alojamento', icon: PrimeIcons.HOME },
          { label: 'Veículos', icon: PrimeIcons.CAR },
          { label: 'Relatórios', icon: PrimeIcons.CLIPBOARD },
          { label: 'Movimentações', icon: PrimeIcons.REPLY },
          { label: 'Ajustes', icon: PrimeIcons.COG },
        ]
      },
      {
        label: '',
        items: [
          { label: '', icon: PrimeIcons.SIGN_OUT }
        ]
      }
    ];
  }
}
