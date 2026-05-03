import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { HomePageService } from '../../services/home-page-service';
import { MessageService } from 'primeng/api';
import { GetHomePageDTO } from '../../dtos/get-home-page-dto';

@Component({
  selector: 'app-home-page',
  imports: [SideMenu],
  providers: [MessageService],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private homePageService = inject(HomePageService);
  private messageService = inject(MessageService);
  public homePageData: GetHomePageDTO | null = null;

  ngAfterViewInit() {
    this.getEmployees();
  }

  public getEmployees() {
    this.homePageService.get().subscribe({
      next: (value) => {
        this.homePageData = value;
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados da página inicial. Tente novamente'})
      }
    });
  }
}
