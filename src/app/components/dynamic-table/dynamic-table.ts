import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { PopoverModule } from 'primeng/popover';
import { MessageService } from 'primeng/api';

export enum TypeTableColumn {
  Text = 'text',
  Status = 'status'
}
export interface TableColumn {
  fieldAPI: string;
  header: string;
  width?: string;
  type?: TypeTableColumn;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  buttonClass?: string;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, TableModule, ToastModule, ButtonModule, InputTextModule, RippleModule, FormsModule, PopoverModule],
  providers: [MessageService],
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss',
})
export class DynamicTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() dataKey: string = 'id';
  @Input() actions: TableAction[] = [];

  @Output() onAction = new EventEmitter<{ action: string; item: any }>();

  selectedItem: any = null;

  getStatusColor(status: string): string {
    switch (status) {
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      case 'warn': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  openPopover(event: Event, popover: any, item: any) {
    this.selectedItem = item;
    popover.toggle(event);
  }

  executeAction(action: string, popover: any) {
    popover.hide();
    this.onAction.emit({ action, item: this.selectedItem });
  }
}
