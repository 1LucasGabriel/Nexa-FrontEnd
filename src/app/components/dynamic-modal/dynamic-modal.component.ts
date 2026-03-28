// dynamic-modal.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';

// ──────────────────────────────────────────────
// MODELOS PÚBLICOS — importe estes nos seus pages
// ──────────────────────────────────────────────

/** Tipos de campo suportados pela modal dinâmica */
export type ModalFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'inputnumber'
  | 'toggle'
  | 'radio';

/** Opção para campos select / multiselect / radio */
export interface FieldOption {
  label: string;
  value: any;
}

/** Definição de um campo do formulário */
export interface ModalField {
  /** Chave única — nome do controle no FormGroup */
  key: string;
  /** Label exibida ao usuário */
  label: string;
  /** Tipo do campo */
  type: ModalFieldType;
  /** Valor inicial (opcional) */
  defaultValue?: any;
  /** Torna o campo obrigatório */
  required?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Ocupa metade da largura (útil para campos lado a lado) */
  halfWidth?: boolean;
  /** Texto de ajuda abaixo do campo */
  hint?: string;
  /** Validadores Angular extras */
  validators?: ValidatorFn[];
  /** Mensagem de erro customizada */
  errorMessage?: string;

  // Opções para select / multiselect / radio
  options?: FieldOption[];

  // InputNumber
  min?: number;
  max?: number;
  decimals?: number;
  showButtons?: boolean;
  currency?: string; // ex: 'BRL'

  // Textarea
  rows?: number;
}

/** Configuração completa da modal */
export interface ModalConfig {
  /** Título exibido no header */
  title: string;
  /** Largura da modal (padrão: '480px') */
  width?: string;
  /** Vetor de campos */
  fields: ModalField[];
  /** Texto do botão cancelar */
  cancelLabel?: string;
  /** Texto do botão confirmar */
  confirmLabel?: string;
  /** Ícone do botão confirmar */
  confirmIcon?: string;
}

// ──────────────────────────────────────────────
// COMPONENTE
// ──────────────────────────────────────────────

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    InputNumberModule,
    ToggleSwitchModule,
    RadioButtonModule,
  ],
})
export class DynamicModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  /** Controla a visibilidade da modal */
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  /** Configuração com título e campos */
  @Input({ required: true }) config!: ModalConfig;

  /** Emite os valores do formulário ao confirmar */
  @Output() confirm = new EventEmitter<Record<string, any>>();

  /** Emite ao cancelar / fechar */
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;

  // Reconstrói o formulário sempre que a config mudar
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const controls: Record<string, any> = {};

    for (const field of this.config.fields) {
      const validators: ValidatorFn[] = [];

      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      if (field.validators) validators.push(...field.validators);

      const initial = field.defaultValue ?? (field.type === 'toggle' ? false : null);
      controls[field.key] = [initial, validators];
    }

    this.form = this.fb.group(controls);
  }

  isInvalid(key: string): boolean {
    const ctrl = this.form?.get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  getError(field: ModalField): string {
    if (field.errorMessage) return field.errorMessage;

    const ctrl = this.form?.get(field.key);
    if (!ctrl?.errors) return '';

    if (ctrl.errors['required']) return `${field.label} é obrigatório`;
    if (ctrl.errors['email']) return 'E-mail inválido';
    if (ctrl.errors['min']) return `Valor mínimo: ${ctrl.errors['min'].min}`;
    if (ctrl.errors['max']) return `Valor máximo: ${ctrl.errors['max'].max}`;
    if (ctrl.errors['minlength'])
      return `Mínimo de ${ctrl.errors['minlength'].requiredLength} caracteres`;

    return 'Valor inválido';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;

    // Simula latência de API — remova e substitua pela chamada real
    setTimeout(() => {
      this.loading = false;
      this.confirm.emit(this.form.value);
      this.closeModal();
    }, 800);
  }

  onCancel(): void {
    this.cancel.emit();
    this.closeModal();
  }

  onHide(): void {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  private closeModal(): void {
    this.form.reset();
    this.visibleChange.emit(false);
  }
}
