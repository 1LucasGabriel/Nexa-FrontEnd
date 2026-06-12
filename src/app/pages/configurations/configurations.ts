import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenu } from '../../components/side-menu/side-menu';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configurations',
  imports: [
    CommonModule,
    FormsModule,
    SideMenu,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    DatePickerModule,
    ToggleSwitchModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './configurations.html',
  styleUrl: './configurations.scss',
})
export class Configurations implements OnInit {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  // User details
  public user: any = {
    id: null,
    email: '',
    fullName: '',
    role: '',
    hireDate: null,
    phoneNumber: '',
    cpf: '',
    lastPasswordChange: ''
  };

  // Form edit fields
  public formModel: any = {
    fullName: '',
    role: '',
    hireDate: null,
    phoneNumber: '',
    cpf: ''
  };

  // Password modal
  public isPasswordModalOpen = false;
  public passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  // Local preferences
  public preferences = {
    twoFactorEnabled: true,
    lightMode: false,
    language: 'pt',
    timezone: 'America/Sao_Paulo'
  };

  public languages = [
    { label: 'Português', value: 'pt' },
    { label: 'Inglês', value: 'en' },
    { label: 'Espanhol', value: 'es' }
  ];

  public timezones = [
    { label: '(UTC-03:00) Brasília', value: 'America/Sao_Paulo' },
    { label: '(UTC-05:00) Eastern Time', value: 'America/New_York' },
    { label: '(UTC+00:00) Coordinated Universal Time', value: 'UTC' }
  ];

  ngOnInit() {
    this.loadUserData();
    this.loadLocalPreferences();
  }

  public loadUserData() {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.formModel.fullName = data.fullName || '';
        this.formModel.role = data.role || '';
        this.formModel.phoneNumber = data.phoneNumber || '';
        this.formModel.cpf = data.cpf || '';
        if (data.hireDate) {
          this.formModel.hireDate = new Date(data.hireDate);
        } else {
          this.formModel.hireDate = null;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as informações do usuário.'
        });
      }
    });
  }

  public savePersonalData() {
    if (!this.formModel.fullName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'O nome completo é obrigatório.'
      });
      return;
    }

    const payload = {
      fullName: this.formModel.fullName,
      role: this.formModel.role,
      hireDate: this.formModel.hireDate ? this.formModel.hireDate.toISOString() : null,
      phoneNumber: this.formModel.phoneNumber,
      cpf: this.formModel.cpf
    };

    this.userService.updateMe(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dados pessoais atualizados com sucesso!'
        });
        this.loadUserData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao atualizar dados pessoais.'
        });
      }
    });
  }

  public openPasswordModal() {
    this.passwordData.newPassword = '';
    this.passwordData.confirmPassword = '';
    this.isPasswordModalOpen = true;
  }

  public changePassword() {
    if (!this.passwordData.newPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, digite a nova senha.'
      });
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem.'
      });
      return;
    }

    const payload = {
      newPassword: this.passwordData.newPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha alterada com sucesso!'
        });
        this.isPasswordModalOpen = false;
        this.loadUserData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao alterar a senha.'
        });
      }
    });
  }

  public loadLocalPreferences() {
    const saved = localStorage.getItem('nexa_preferences');
    if (saved) {
      try {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      } catch (e) {}
    }
  }

  public saveLocalPreference() {
    localStorage.setItem('nexa_preferences', JSON.stringify(this.preferences));
    this.messageService.add({
      severity: 'info',
      summary: 'Preferências',
      detail: 'Preferência atualizada localmente.',
      life: 1500
    });
  }

  public getFirstName(fullName: string): string {
    if (!fullName) return 'Usuário';
    return fullName.split(' ')[0];
  }

  public irParaHome() {
    this.router.navigate(['/home']);
  }
}
