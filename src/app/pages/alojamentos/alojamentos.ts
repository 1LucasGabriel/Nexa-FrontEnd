import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

import { SideMenu } from '../../components/side-menu/side-menu';
import { DynamicTable, TableColumn, TableAction } from '../../components/dynamic-table/dynamic-table';
import { DynamicModal, ModalConfig, ModalFieldType } from '../../components/dynamic-modal/dynamic-modal';
import { DynamicButton } from '../../components/dynamic-button/dynamic-button';
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';

import { HousingService } from '../../services/housing.service';
import { AddressService } from '../../services/address.service';
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
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './alojamentos.html',
  styleUrl: './alojamentos.scss',
})
export class Alojamento {

  housingOptions: any[] = [];

  // ─── Injeções ─────────────────────────────────────────────
  private messageService      = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private housingService      = inject(HousingService);
  private addressService      = inject(AddressService);

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

  // ─── Estado de Endereço ──────────────────────────────────
  isAddressModalOpen      = false;
  addresses: any[]        = [];
  loadingAddresses        = false;
  newAddress = {
    name: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  };

  // ─── Estado de Quarto ───────────────────────────────────
  isRoomModalOpen         = false;
  roomsList: any[]        = [];
  loadingRooms            = false;
  newRoom = {
    housingId: null as number | null,
    number: '',
    maxCapacity: null as number | null,
    housingRoomType: 1 as number | null
  };

  roomTypeOptions = [
    { label: 'Quarto', value: 1 },
    { label: 'Apartamento', value: 2 },
    { label: 'Outro', value: 3 }
  ];

  // ─── Ciclo de vida ────────────────────────────────────────
  ngAfterViewInit() {
    this.getAlojamentos();
    this.loadAddresses();
    this.loadRooms();
  }

  // ─── CRUD ─────────────────────────────────────────────────
  public getAlojamentos() {
    this.housingService.getHousings().subscribe({
      next: (value: Housing[]) => {
        const formattedData = value.map(h => ({
          id: h.id,
          nome: h.name,
          status: h.housingStatus === 1 ? 'disponivel' : 'lotado',
          endereco: h.address ? `${h.address.street}, ${h.address.number || 'S/N'}` : 'N/A',
          cidade: h.address ? `${h.address.city} - ${h.address.state || 'BR'}` : 'N/A',
          cep: h.address?.zipCode || 'N/A',
          capacidade: h.maxCapacity,
          ocupacao: h.currentCapacity,
          tipo: h.housingType === 1 ? 'masculino' : h.housingType === 2 ? 'feminino' : 'misto',
          addressId: h.addressId
        }));
        this.originalData = formattedData;
        this.filteredData = [...formattedData];
        this.housingOptions = formattedData.map(h => ({
          label: h.nome,
          value: h.id
        }));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar alojamentos. Tente novamente' });
      }
    });
  }

  public createAlojamento(dados: any) {
    const payload = {
      name: dados.nome,
      addressId: Number(dados.addressId),
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
      addressId: Number(dados.addressId),
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
        key: 'addressId',
        label: 'Endereço',
        icon: 'pi pi-map-marker',
        type: ModalFieldType.Select,
        required: true,
        placeholder: 'Selecione o endereço',
        width: '65%',
        options: [],
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

  addressColumns: TableColumn[] = [
    { fieldAPI: 'id',               header: 'ID',                  width: '80px'  },
    { fieldAPI: 'name',             header: 'Identificação',        width: '150px' },
    { fieldAPI: 'enderecoCompleto', header: 'Endereço Completo'                    }
  ];

  addressActions: TableAction[] = [
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-text p-button-sm p-button-danger' }
  ];

  roomColumns: TableColumn[] = [
    { fieldAPI: 'id',          header: 'ID',                 width: '80px'  },
    { fieldAPI: 'housingName', header: 'Alojamento',         width: '200px' },
    { fieldAPI: 'number',      header: 'Número do Quarto',   width: '180px' },
    { fieldAPI: 'tipoLabel',   header: 'Tipo',               width: '120px' },
    { fieldAPI: 'maxCapacity', header: 'Capac. Máx.',        width: '120px' },
    { fieldAPI: 'currentCapacity', header: 'Ocupação Atual', width: '120px' }
  ];

  roomActions: TableAction[] = [
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-text p-button-sm p-button-danger' }
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

  public handleAddressAction(event: { action: string; item: any }) {
    if (event.action === 'delete') {
      this.deleteAddress(event.item.id);
    }
  }

  public handleRoomAction(event: { action: string; item: any }) {
    if (event.action === 'delete') {
      this.deleteRoom(event.item.id);
    }
  }

  // ─── Pesquisa ─────────────────────────────────────────────
  onSearch(term: string) {
    const lower = term.toLowerCase();
    this.filteredData = this.originalData.filter(item =>
      Object.values(item).some(value => String(value).toLowerCase().includes(lower))
    );
  }

  // ─── Gerenciamento de Endereços ───────────────────────────
  public openAddressModal() {
    this.isAddressModalOpen = true;
    this.loadAddresses();
  }

  public loadAddresses() {
    this.loadingAddresses = true;
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data.map(a => ({
          ...a,
          enderecoCompleto: `${a.street || ''}, ${a.number || ''} - ${a.city || ''}/${a.state || ''}`
        }));

        // Atualiza as opções do dropdown dinâmico no config do modal
        const addressField = this.config.fields.find(f => f.key === 'addressId');
        if (addressField) {
          addressField.options = this.addresses.map(a => ({
            label: `${a.name || ''} (${a.street || ''}, ${a.number || ''})`,
            value: a.id
          }));
        }

        this.loadingAddresses = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar endereços.' });
        this.loadingAddresses = false;
      }
    });
  }

  public createAddress() {
    if (!this.newAddress.name || !this.newAddress.street || !this.newAddress.number || !this.newAddress.city || !this.newAddress.state) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, preencha os campos obrigatórios (Nome, Rua, Número, Cidade, Estado).' });
      return;
    }

    this.addressService.postAddress(this.newAddress).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Endereço cadastrado com sucesso!' });
        this.newAddress = {
          name: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil'
        };
        this.loadAddresses();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar endereço.' });
      }
    });
  }

  public deleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Endereço excluído com sucesso!' });
        this.loadAddresses();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir endereço.' });
      }
    });
  }

  // ─── Gerenciamento de Quartos ──────────────────────────────
  public openRoomModal() {
    this.isRoomModalOpen = true;
    this.loadRooms();
  }

  public loadRooms() {
    this.loadingRooms = true;
    this.housingService.getHousingRooms().subscribe({
      next: (data) => {
        this.roomsList = (data || []).map(r => {
          const housing = this.originalData.find(h => Number(h.id) === Number(r.housingId));
          const typeLabel = r.housingRoomType === 1 ? 'Quarto' : r.housingRoomType === 2 ? 'Apartamento' : r.housingRoomType === 3 ? 'Outro' : 'N/A';
          return {
            ...r,
            number: r.number || r.name || r.roomNumber || `Quarto ${r.id}`,
            maxCapacity: r.maxCapacity || r.capacity || 0,
            currentCapacity: r.currentCapacity || 0,
            tipoLabel: typeLabel,
            housingName: housing ? housing.nome : `Alojamento ${r.housingId}`
          };
        });
        this.loadingRooms = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar quartos.' });
        this.loadingRooms = false;
      }
    });
  }

  public createRoom() {
    if (!this.newRoom.housingId || !this.newRoom.number || this.newRoom.maxCapacity === null || this.newRoom.maxCapacity === undefined || !this.newRoom.housingRoomType) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, preencha os campos obrigatórios (Alojamento, Tipo do Quarto, Número do Quarto, Capacidade Máxima).' });
      return;
    }

    const payload = {
      housingId: Number(this.newRoom.housingId),
      name: String(this.newRoom.number),
      number: String(this.newRoom.number),
      capacity: Number(this.newRoom.maxCapacity),
      maxCapacity: Number(this.newRoom.maxCapacity),
      housingRoomType: Number(this.newRoom.housingRoomType)
    };

    this.housingService.postHousingRoom(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Quarto cadastrado com sucesso!' });
        this.newRoom = {
          housingId: null,
          number: '',
          maxCapacity: null,
          housingRoomType: 1
        };
        this.loadRooms();
      },
      error: (err) => {
        const msg = err.error?.detail || (err.error?.errors ? Object.values(err.error.errors).flat().join(', ') : 'Erro ao cadastrar quarto.');
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
      }
    });
  }

  public deleteRoom(id: number) {
    this.housingService.deleteHousingRoom(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Quarto excluído com sucesso!' });
        this.loadRooms();
      },
      error: (err) => {
        const msg = err.error?.detail || 'Erro ao excluir quarto.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
      }
    });
  }
}