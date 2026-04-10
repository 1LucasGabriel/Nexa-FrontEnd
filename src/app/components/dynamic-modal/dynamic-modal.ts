import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export enum ModalFieldType {
  Text        = 'text',
  Email       = 'email',
  Password    = 'password',
  Textarea    = 'textarea',
  Select      = 'select',
  Multiselect = 'multiselect',
  Date        = 'date',
  InputNumber = 'inputnumber',
  Toggle      = 'toggle',
  Radio       = 'radio',
}

export interface FieldOption {
  label: string;
  value: any;
  color?: string;
}

export interface ModalField {
  key:           string;
  label:         string;
  type:          ModalFieldType;
  icon?:         string;
  width?:        string;
  defaultValue?: any;
  required?:     boolean;
  placeholder?:  string;
  halfWidth?:    boolean;
  hint?:         string;
  validators?:   ValidatorFn[];
  errorMessage?: string;
  options?:      FieldOption[];
  min?:          number;
  max?:          number;
  decimals?:     number;
  showButtons?:  boolean;
  currency?:     string;
  rows?:         number;
}

export interface ModalConfig {
  title:         string;
  width?:        string;
  fields:        ModalField[];
  cancelLabel?:  string;
  confirmLabel?: string;
}

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  templateUrl: './dynamic-modal.html',
  styleUrl: './dynamic-modal.scss',
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
    IconFieldModule,
    InputIconModule,
  ],
})
export class DynamicModal implements OnChanges {
  readonly ModalFieldType = ModalFieldType;
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input({ required: true }) config!: ModalConfig;
  @Output() confirm = new EventEmitter<Record<string, any>>();
  @Output() cancel  = new EventEmitter<void>();

  form!: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) this.buildForm();
    if (changes['visible']?.currentValue === true) {
      this.form?.markAsUntouched();
      this.form?.markAsPristine();
    }
  }

  private buildForm(): void {
    const controls: Record<string, any> = {};
    for (const field of this.config.fields) {
      const vals: ValidatorFn[] = [];
      if (field.required)                      vals.push(Validators.required);
      if (field.type === ModalFieldType.Email)  vals.push(Validators.email);
      if (field.validators)                    vals.push(...field.validators);
      controls[field.key] = [field.defaultValue ?? (field.type === ModalFieldType.Toggle ? false : null), vals];
    }
    this.form = this.fb.group(controls);
  }

  submitted = false;

  isInvalid(key: string): boolean {
    const ctrl = this.form?.get(key);
    return !!(ctrl?.invalid && (ctrl?.touched && this.submitted || ctrl?.dirty));
  }

  getError(field: ModalField): string {
    if (field.errorMessage) return field.errorMessage;
    const errors = this.form?.get(field.key)?.errors;
    if (!errors) return '';
    if (errors['required'])  return `${field.label} é obrigatório`;
    if (errors['email'])     return 'E-mail inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['min'])       return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max'])       return `Valor máximo: ${errors['max'].max}`;
    return 'Valor inválido';
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.confirm.emit(this.form.value);
    this.closeModal();
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
    this.submitted = false;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.visibleChange.emit(false);
  }
}