import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { SideMenu } from '../../components/side-menu/side-menu';
import { DynamicTable, TableColumn, TableAction } from '../../components/dynamic-table/dynamic-table';
import { DynamicModal, ModalConfig, ModalFieldType } from '../../components/dynamic-modal/dynamic-modal';
import { DynamicButton } from '../../components/dynamic-button/dynamic-button';
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';

// import { AlojamentoService } from '../../services/alojamento-service';
// import { Alojamento } from '../../models/alojamento';
// import { CreateUpdateAlojamentoDTO } from '../../dtos/create-update-alojamento-dto';

@Component({
  selector: 'app-alojamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SideMenu,
    DynamicTable,
    DynamicModal,
    DynamicButton,
    DynamicSearchBar,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './alojamentos.html',
  styleUrl: './alojamentos.scss',
})
export class Alojamento {

  // ─── Injeções ─────────────────────────────────────────────
  private messageService     = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  // private alojamentoService = inject(AlojamentoService);

  // ─── Usuário ──────────────────────────────────────────────
  userName = 'Usuário';
  userRole = 'Administrador';

  // ─── Estado ───────────────────────────────────────────────
  isEditMode       = false;
  selectedAlojamento: any = null;
  isModalOpen      = false;
  loading          = false;
  totalRecords     = 0;
  rows             = 10;
  originalData: any[] = [];
  filteredData: any[] = [];

  // ─── Ciclo de vida ────────────────────────────────────────
  ngAfterViewInit() {
    this.getAlojamentos();
  }

  // ─── CRUD ─────────────────────────────────────────────────
  public getAlojamentos() {
    // this.alojamentoService.getAlojamentos().subscribe({
    //   next: (value) => {
    //     this.originalData = value;
    //     this.filteredData = [...value];
    //   },
    //   error: () => {
    //     this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar alojamentos. Tente novamente' });
    //   }
    // });

    // Dados mockados — remover quando integrar a API:
    this.originalData = [
      { id: 1, status: 'disponivel', endereco: 'Av. Washington Luiz, 363', cidade: 'São Paulo - BR', cep: '19842-685', capacidade: 7,  ocupacao: 7,  tipo: 'Masculino' },
      { id: 2, status: 'disponivel', endereco: 'Av. Rio Branco, 82',       cidade: 'Marília - BR',   cep: '19502-080', capacidade: 31, ocupacao: 12, tipo: 'Misto'     },
      { id: 3, status: 'lotado',     endereco: 'Ld. Luís de Camões, 191',  cidade: 'Lisboa - PT',    cep: '1000-017',  capacidade: 20, ocupacao: 20, tipo: 'Masculino' },
      { id: 4, status: 'disponivel', endereco: 'R. Palestra Itália, 200',  cidade: 'São Paulo - BR', cep: '05001-200', capacidade: 15, ocupacao: 14, tipo: 'Feminino'  },
    ];
    this.filteredData = [...this.originalData];
  }

  public createAlojamento(dados: any) {
    // this.alojamentoService.postAlojamento(dados).subscribe({
    //   next: () => {
    //     this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento criado com sucesso!' });
    //     this.getAlojamentos();
    //   },
    //   error: () => {
    //     this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar alojamento. Tente novamente' });
    //   }
    // });
    console.log('Criar alojamento:', dados);
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento criado com sucesso!' });
  }

  public editAlojamento(dados: any) {
    // this.alojamentoService.putAlojamento(dados.id, dados).subscribe({
    //   next: () => {
    //     this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento editado com sucesso!' });
    //     this.getAlojamentos();
    //   },
    //   error: () => {
    //     this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar alojamento. Tente novamente' });
    //   }
    // });
    console.log('Editar alojamento:', dados);
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento editado com sucesso!' });
  }

  public confirmDelete(item: any) {
    this.confirmationService.confirm({
      message: 'Você realmente deseja excluir este alojamento?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Deletar', severity: 'danger' },
      accept: () => this.deleteAlojamento(item),
    });
  }

  public deleteAlojamento(item: any) {
    // this.alojamentoService.deleteAlojamento(item.id).subscribe({
    //   next: () => {
    //     this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento excluído com sucesso!' });
    //     this.getAlojamentos();
    //   },
    //   error: () => {
    //     this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir alojamento. Tente novamente' });
    //   }
    // });
    console.log('Excluir alojamento:', item);
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento excluído com sucesso!' });
  }

  // ─── Modal ────────────────────────────────────────────────
  get modalTitle() {
    return this.isEditMode ? 'Editar Alojamento' : 'Adicionar Alojamento';
  }

  modalConfig: ModalConfig = {
    title: 'Adicionar Alojamento',
    width: '560px',
    confirmLabel: 'Salvar',
    cancelLabel: 'Cancelar',
    fields: [
      {
        key: 'endereco',
        label: 'Endereço',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Ex: Av. Paulista, 1000',
      },
      {
        key: 'cidade',
        label: 'Cidade',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Ex: São Paulo - BR',
        halfWidth: true,
      },
      {
        key: 'cep',
        label: 'CEP',
        type: ModalFieldType.Text,
        required: true,
        placeholder: '00000-000',
        halfWidth: true,
      },
      {
        key: 'capacidade',
        label: 'Capacidade',
        type: ModalFieldType.InputNumber,
        required: true,
        min: 1,
        halfWidth: true,
      },
      {
        key: 'tipo',
        label: 'Tipo',
        type: ModalFieldType.Select,
        required: true,
        halfWidth: true,
        options: [
          { label: 'Masculino', value: 'masculino' },
          { label: 'Feminino',  value: 'feminino'  },
          { label: 'Misto',     value: 'misto'     },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        type: ModalFieldType.Select,
        required: true,
        options: [
          { label: 'Disponível', value: 'disponivel' },
          { label: 'Lotado',     value: 'lotado'     },
        ],
      },
    ],
  };

  public openAddModal() {
    this.isEditMode = false;
    this.selectedAlojamento = null;
    this.modalConfig = { ...this.modalConfig, title: 'Adicionar Alojamento' };
    this.isModalOpen = true;
  }

  public openEditModal(item: any) {
    this.isEditMode = true;
    this.selectedAlojamento = item;
    this.modalConfig = { ...this.modalConfig, title: 'Editar Alojamento' };
    this.isModalOpen = true;
  }

  public onConfirm(dados: any) {
    if (this.isEditMode && this.selectedAlojamento) {
      const updated = { ...this.selectedAlojamento, ...dados };
      this.editAlojamento(updated);
    } else {
      this.createAlojamento(dados);
    }
  }

  public onModalVisibilityChange(value: boolean) {
    this.isModalOpen = value;
    if (!value) {
      this.isEditMode = false;
      this.selectedAlojamento = null;
    }
  }

  // ─── Tabela ───────────────────────────────────────────────
  columns: TableColumn[] = [
    { fieldAPI: 'status',     header: 'Status',   type: 'status', width: '120px' },
    { fieldAPI: 'endereco',   header: 'Endereço'                                 },
    { fieldAPI: 'cidade',     header: 'Cidade',                   width: '140px' },
    { fieldAPI: 'cep',        header: 'CEP',                      width: '110px' },
    { fieldAPI: 'capacidade', header: 'Capac.',                   width: '80px'  },
    { fieldAPI: 'ocupacao',   header: 'Ocup.',                    width: '80px'  },
    { fieldAPI: 'tipo',       header: 'Tipo',     type: 'badge',  width: '110px' },
  ];

  actions: TableAction[] = [
    { label: 'Editar',  icon: 'pi pi-pencil', action: 'editar',  buttonClass: 'p-button-text p-button-sm' },
    { label: 'Excluir', icon: 'pi pi-trash',  action: 'excluir', buttonClass: 'p-button-text p-button-sm p-button-danger' },
  ];

  statusColorMap = {
    disponivel: { color: '#22c55e', label: 'Disponível' },
    lotado:     { color: '#ef4444', label: 'Lotado'     },
  };

  public handleAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'editar':  this.openEditModal(event.item); break;
      case 'excluir': this.confirmDelete(event.item); break;
    }
  }

  // ─── Pesquisa ─────────────────────────────────────────────
  onSearch(term: string) {
    const lower = term.toLowerCase();
    this.filteredData = this.originalData.filter(item =>
      Object.values(item).some(value => String(value).toLowerCase().includes(lower))
    );
  }
}