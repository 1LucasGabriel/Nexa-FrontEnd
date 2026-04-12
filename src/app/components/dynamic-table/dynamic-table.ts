import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';

export type ColumnType = 'text' | 'status' | 'badge';

export interface TableColumn {
  fieldAPI: string;
  header: string;
  width?: string;
  type?: ColumnType;
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
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, PopoverModule, TooltipModule],
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss',
})
export class DynamicTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() dataKey: string = 'id';
  @Input() actions: TableAction[] = [];
  @Input() statusColorMap: { [key: string]: { color: string; label: string } } = {};
  @Input() loading: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;

  @Output() onAction = new EventEmitter<{ action: string; item: any }>();
  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();

  selectedItem: any = null;

  getStatusStyles(value: string) {
    const normalized = value?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.statusColorMap[value] || this.statusColorMap[normalized] || { color: '#6b7280', label: value };
  }

  triggerAction(action: string, item: any) {
    this.onAction.emit({ action, item });
  }

  openPopover(event: Event, popover: any, item: any) {
    this.selectedItem = item;
    popover.toggle(event);
  }

  executeAction(action: string, popover: any) {
    popover.hide();
    this.onAction.emit({ action, item: this.selectedItem });
  }

  loadData(event: TableLazyLoadEvent) {
    this.onLazyLoad.emit(event);
  }
}
