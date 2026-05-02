import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthenticateService } from '../../services/authenticate-service';
import { OutputAuthenticateDTO } from '../../dtos/output-authenticate-dto';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  imports: [InputTextModule, FormsModule, ButtonModule, PasswordModule, ToggleSwitchModule, IconFieldModule, InputIconModule, ToastModule, RippleModule],
  providers: [MessageService],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})

export class LoginPage {
  private authenticateService = inject(AuthenticateService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  keepLogged: boolean = false
  objectAuth: OutputAuthenticateDTO = {
    email: '',
    password: ''
  }

  public sendLogin() {
    this.authenticateService.postLogin(this.objectAuth).subscribe({
      next: (value) => {
        this.authenticateService.setToken(value.token);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Logado com sucesso'})
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao fazer login. Tente novamente'})
      }
    });
  }
}
