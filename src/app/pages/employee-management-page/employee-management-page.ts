import { Component, inject } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { DynamicButton } from "../../components/dynamic-button/dynamic-button";
import { DynamicSearchBar } from '../../components/dynamic-search-bar/dynamic-search-bar';
import { DynamicTable, TableAction, TableColumn } from "../../components/dynamic-table/dynamic-table";
import { DynamicModal, ModalConfig, ModalFieldType } from "../../components/dynamic-modal/dynamic-modal";
import { EmployeeService } from '../../services/employee-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee } from '../../models/employee';
import { CreateUpdateEmployeeDTO } from '../../dtos/create-update-employee-dto';
import { EmployeeStatus } from '../../enums/employee-status';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-employee-management-page',
  imports: [SideMenu, DynamicButton, DynamicSearchBar, DynamicTable, DynamicModal, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-management-page.html',
  styleUrl: './employee-management-page.scss',
})
export class EmployeeManagementPage {
  private messageService = inject(MessageService);
  private employeeService = inject(EmployeeService);
  private confirmationService = inject(ConfirmationService);
  public employees: Employee[] = [];
  public buttonText = 'Adicionar Funcionário';
  isEditMode: boolean = false;
  selectedEmployee: Employee | null = null;
  data: any[] = [];
  totalRecords = 0;
  loading = false;
  rows = 10;
  searchTerm: string = '';
  originalData: any[] = [];
  filteredData: any[] = []; 

  ngAfterViewInit() {
    this.getEmployees();
  }

  public getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (value) => {
        this.employees = value;
        this.originalData = value;
        this.filteredData = [...value];
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar funcionários. Tente novamente'})
      }
    });
  }

  public createEmployee(employee: CreateUpdateEmployeeDTO) {
    this.employeeService.postEmployees(employee).subscribe({
      next: (value) => {
        console.log(value);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Funcionário criado com sucesso!'});
        this.getEmployees();
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao criar funcionário. Tente novamente'})
      }
    });
  }

  public editEmployee(employee: Employee) {
    this.employeeService.putEmployees(employee.id, employee).subscribe({
      next: (value) => {
        console.log(value);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Funcionário editado com sucesso!'});
        this.getEmployees();
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao editar funcionário. Tente novamente'})
      }
    })
  }

  public confirmDelete(employee: Employee) {
    this.confirmationService.confirm({
      message: 'Você realmente deseja excluir este funcionário?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Deletar', severity: 'danger' },

      accept: () => {
        this.deleteEmployee(employee);
      }
    });
  }

  public deleteEmployee(employee: Employee) {
    this.employeeService.deleteEmployees(employee.id).subscribe({
      next: (value) => {
        console.log(value);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Funcionário excluído com sucesso!'});
        this.getEmployees();
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao excluir funcionário. Tente novamente'})
      }
    })
  }







  //Configuração Tabela
  columns: TableColumn[] = [
    { fieldAPI: 'status', header: 'Status', type: 'status' },
    { fieldAPI: 'name', header: 'Nome' },
    { fieldAPI: 'cpf', header: 'CPF' },
    { fieldAPI: 'role', header: 'Cargo' },
    { fieldAPI: 'phoneNumber', header: 'Telefone' },
    { fieldAPI: 'hireDate', header: 'Data de Admissão' },
  ];

  actions: TableAction[] = [
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
    { label: 'Excluir', icon: 'pi pi-trash', action: 'delete', buttonClass: 'p-button-danger' },
  ];

  statusColorMap = {
    0: { color: '#22c55e', label: 'Ativo' },
    1: { color: '#f59e0b', label: 'Em Férias' },
    2: { color: '#ef4444', label: 'Demitido' },
  };

  public handleAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.item);
        break;

      case 'delete':
        this.confirmDelete(event.item);
        break;
    }
  }



  //Configuração Modal
  public isModalOpen: boolean = false;

  config: ModalConfig = {
    title: this.modalTitle,
    width: '800px',
    fields: [
      { key: 'name', label: 'Nome Completo', type: ModalFieldType.Text, width: '70%' },
      { key: 'cpf', label: 'CPF', type: ModalFieldType.Text, width: '20%' },
      { key: 'role', label: 'Cargo', type: ModalFieldType.Text, width: '20%' },
      { key: 'phoneNumber', label: 'Telefone', type: ModalFieldType.Text, width: '20%' },
      { key: 'hireDate', label: 'Data de Admissão', type: ModalFieldType.Date, width: '20%' },
      { key: 'status', label: 'Status', type: ModalFieldType.Select, width: '20%', options: [{ label: 'Ativo', value: EmployeeStatus.Active }, { label: 'Em Férias', value: EmployeeStatus.OnVacation }, { label: 'Demitido', value: EmployeeStatus.Dismissed }] },
    ]
  }

  get modalTitle() {
    return this.isEditMode ? 'Editar Funcionário' : 'Adicionar Funcionário';
  }

  public openAddModal() {
    this.isModalOpen = true;
  }

  public onConfirm(data: any) {
    if (this.isEditMode && this.selectedEmployee) {
      const updatedEmployee = {
        ...this.selectedEmployee,
        ...data
      };

      this.editEmployee(updatedEmployee);
    } 
    else {
      data.userId = 1; //Remover isso depois, é só para teste
      this.createEmployee(data);
    }
  }

  public openEditModal(employee: Employee) {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.isModalOpen = true;
  }

  public onModalVisibilityChange(value: boolean) {
    this.isModalOpen = value;

    if (!value) {
      this.isEditMode = false;
      this.selectedEmployee = null;
    }
  }



  //Configuração SearchBar
  onSearch(term: string) {
    const lower = term.toLowerCase();

    this.filteredData = this.originalData.filter(item => 
      Object.values(item).some(value => String(value).toLowerCase().includes(lower))
    );
  }

}
