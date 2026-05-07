import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { SideMenu } from '../../components/side-menu/side-menu';
import { DynamicTable, TableColumn, TableAction } from '../../components/dynamic-table/dynamic-table';
import { DynamicModal, ModalConfig, ModalFieldType } from '../../components/dynamic-modal/dynamic-modal';
import { DynamicButton } from '../../components/dynamic-button/dynamic-button';
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';

import { HousingService } from '../../services/housing.service';
import { Housing } from '../../models/housing';

@Component({
  selector: 'app-alojamento',
  standalone: true,
  imports: [
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
  private messageService      = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private housingService      = inject(HousingService);

  // ─── Estado ───────────────────────────────────────────────
  isEditMode              = false;
  selectedAlojamento: any = null;
  isModalOpen             = false;
  loading                 = false;
  totalRecords            = 0;
  rows                    = 10;
  originalData: any[]     = [];
  filteredData: any[]     = [];
  buttonText              = 'Adicionar Alojamento';

  // ─── Ciclo de vida ────────────────────────────────────────
  ngAfterViewInit() {
    this.getAlojamentos();
  }

  // ─── CRUD ─────────────────────────────────────────────────
  public getAlojamentos() {
    this.housingService.getHousings().subscribe({
      next: (value: Housing[]) => {
        const formattedData = value.map(h => ({
          id: h.id,
          nome: h.name,
          status: h.housingStatus === 0 ? 'disponivel' : 'lotado',
          endereco: h.address ? `${h.address.street}, ${h.address.number || 'S/N'}` : 'N/A',
          cidade: h.address ? `${h.address.city} - ${h.address.state || 'BR'}` : 'N/A',
          cep: h.address?.zipCode || 'N/A',
          capacidade: h.maxCapacity,
          ocupacao: h.currentCapacity,
          tipo: h.housingType === 1 ? 'Masculino' : h.housingType === 2 ? 'Feminino' : 'Misto'
        }));
        this.originalData = formattedData;
        this.filteredData = [...formattedData];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar alojamentos. Tente novamente' });
      }
    });
  }

  public createAlojamento(dados: any) {
    const payload = {
      name: dados.nome,
      addressId: 1,
      maxCapacity: dados.capacidade,
      housingType: dados.tipo === 'masculino' ? 1 : (dados.tipo === 'feminino' ? 2 : 3),
      useHousingRoom: true
    };

    this.housingService.postHousing(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento criado com sucesso!' });
        this.getAlojamentos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar alojamento. Tente novamente' });
      }
    });
  }

  public editAlojamento(dados: any) {
    const payload = {
      name: dados.nome,
      addressId: 1,
      maxCapacity: dados.capacidade,
      housingType: dados.tipo === 'masculino' ? 1 : (dados.tipo === 'feminino' ? 2 : 3),
      useHousingRoom: true
    };

    this.housingService.putHousing(dados.id, payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento editado com sucesso!' });
        this.getAlojamentos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar alojamento. Tente novamente' });
      }
    });
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
    this.housingService.deleteHousing(item.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alojamento excluído com sucesso!' });
        this.getAlojamentos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir alojamento. Tente novamente' });
      }
    });
  }

  // ─── Modal ────────────────────────────────────────────────
  get modalTitle() {
    return this.isEditMode ? 'Editar Alojamento' : 'Adicionar Alojamento';
  }

  config: ModalConfig = {
    title: this.modalTitle,
    width: '740px',
    confirmLabel: 'Salvar',
    cancelLabel: 'Voltar',
    fields: [
      {
        key: 'nome',
        label: 'Nome',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Digite o nome do alojamento',
        width: '30%',
      },
      {
        key: 'endereco',
        label: 'Endereço',
        icon: 'pi pi-map-marker',
        type: ModalFieldType.Text,
        required: true,
        placeholder: 'Digite o endereço',
        width: '65%',
      },
      {
        key: 'tipo',
        label: 'Tipo',
        icon: 'pi pi-home',
        type: ModalFieldType.Select,
        required: true,
        placeholder: 'Selecione o tipo',
        width: '45%',
        options: [
          { label: 'Masculino', value: 'masculino', color : '#3b82f6' },
          { label: 'Feminino',  value: 'feminino',  color: '#ec4899' },
          { label: 'Misto',     value: 'misto',     color: '#8b5cf6' },
        ],
      },
      {
        key: 'capacidade',
        label: 'Capacidade',
        icon: 'pi pi-users',
        type: ModalFieldType.InputNumber,
        required: true,
        placeholder: '0',
        min: 0,
        width: '49%',
      },
    ],
  };

  public openAddModal() {
    this.isEditMode = false;
    this.selectedAlojamento = null;
    this.isModalOpen = true;
  }

  public openEditModal(item: any) {
    this.isEditMode = true;
    this.selectedAlojamento = item;
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
    { fieldAPI: 'nome',       header: 'Nome',                     width: '120px' },
    { fieldAPI: 'endereco',   header: 'Endereço'                                 },
    { fieldAPI: 'cidade',     header: 'Cidade',                   width: '140px' },
    { fieldAPI: 'cep',        header: 'CEP',                      width: '110px' },
    { fieldAPI: 'capacidade', header: 'Capac.',                   width: '80px'  },
    { fieldAPI: 'ocupacao',   header: 'Ocup.',                    width: '80px'  },
    { fieldAPI: 'tipo',       header: 'Tipo',     type: 'badge',  width: '110px' },
  ];

  actions: TableAction[] = [
    { label: 'Editar',  icon: 'pi pi-pencil', action: 'edit',   buttonClass: 'p-button-text p-button-sm' },
    { label: 'Excluir', icon: 'pi pi-trash',  action: 'delete', buttonClass: 'p-button-text p-button-sm p-button-danger' },
  ];

  statusColorMap = {
    disponivel: { color: '#22c55e', label: 'Disponível' },
    lotado:     { color: '#ef4444', label: 'Lotado'     },
    masculino:   { color: '#3b82f6', label: 'Masculino'  },
    feminino:    { color: '#ec4899', label: 'Feminino'   },
    misto:       { color: '#8b5cf6', label: 'Misto'      },
  };

  public handleAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'edit':   this.openEditModal(event.item); break;
      case 'delete': this.confirmDelete(event.item); break;
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