import { Component } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';
import { DynamicTable, TableAction, TableColumn } from "../../components/dynamic-table/dynamic-table";
import { DynamicModal, ModalConfig, ModalFieldType } from "../../components/dynamic-modal/dynamic-modal";

@Component({
  selector: 'app-employee-management-page',
  imports: [SideMenu, DynamicButton, DynamicSearchBar, DynamicTable, DynamicModal],
  templateUrl: './employee-management-page.html',
  styleUrl: './employee-management-page.scss',
})
export class EmployeeManagementPage {

  //Configuração Tabela
  public buttonText = 'Adicionar Funcionário';

  columns: TableColumn[] = [
    { fieldAPI: 'status', header: 'Status', type: 'status' },
    { fieldAPI: 'name', header: 'Nome' },
    { fieldAPI: 'cpf', header: 'CPF' },
    { fieldAPI: 'cargo', header: 'Cargo' },
    { fieldAPI: 'telefone', header: 'Telefone' },
    { fieldAPI: 'dta', header: 'Data de Admissão' },
  ];

  data = [
    { name: 'Lucas Gabriel', cpf: '555.555.555-55', status: 'ativo', cargo: 'Administrador', telefone: '(11) 99999-9999', dta: '01/01/2020' },
    { name: 'Ana Souza', cpf: '666.666.666-66', status: 'ferias', cargo: 'Gerente', telefone: '(11) 99999-9999', dta: '01/01/2020' },
    { name: 'Carlos Lima', cpf: '777.777.777-77', status: 'demitido', cargo: 'Gerente', telefone: '(11) 99999-9999', dta: '01/01/2020' },
    { name: 'Mariana Alves', cpf: '888.888.888-88', status: 'ativo', cargo: 'Usuário', telefone: '(11) 99999-9999', dta: '01/01/2020' },
  ];

  actions: TableAction[] = [
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
    { label: 'Histório de Movimentação', icon: 'pi pi-eye', action: 'view' },
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-danger' },
  ];

  statusColorMap = {
    ativo: { color: '#22c55e', label: 'Ativo' },
    ferias: { color: '#f59e0b', label: 'Em Férias' },
    demitido: { color: '#ef4444', label: 'Demitido' },
  };

  public handleAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'edit':
        this.editEmployee(event.item);
        break;

      case 'delete':
        this.deleteEmployee(event.item);
        break;
    }
  }

  public editEmployee(item: any) {
    console.log('Editando:', item);
  }

  public deleteEmployee(item: any) {
    console.log('Deletando:', item);
  }




  //Configuração Modal
  public isModalOpen: boolean = false;
  
  config: ModalConfig = {
    title: 'Adicionar Funcionário',
    width: '800px',
    fields: [
      { key: 'nome', label: 'Nome Completo', type: ModalFieldType.Text, width: '70%' },
      { key: 'cpf', label: 'CPF', type: ModalFieldType.Text, width: '20%' },
      { key: 'cargo', label: 'Cargo', type: ModalFieldType.Text, width: '20%' },
      { key: 'telefone', label: 'Telefone', type: ModalFieldType.Text, width: '20%' },
      { key: 'dta', label: 'Data de Admissão', type: ModalFieldType.Date, width: '20%' },
      { key: 'status', label: 'Status', type: ModalFieldType.Select, width: '20%' },
    ]
  }

  public addEmployee() {
    this.isModalOpen = true;
  }

}
