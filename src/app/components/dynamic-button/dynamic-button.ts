import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-dynamic-button',
  imports: [ButtonModule, CommonModule],
  templateUrl: './dynamic-button.html',
  styleUrl: './dynamic-button.scss',
})
export class DynamicButton {
  @Input() text: string = ''
  @Input() isRounded: boolean = false
  @Input() width: string = '280px'
  @Input() height: string = '40px'

  @Input() bgColor: string = '#4F46E5'
  @Input() bgColorHover: string = '#4F46E5'
  @Input() bgColorActive: string = '#4F46E5'

  @Input() textColor: string = '#ffffff'
  @Input() textColorHover: string = '#ffffff'
  @Input() textColorActive: string = '#ffffff'

  @Output() buttonClick = new EventEmitter<void>();

  public onClick() {
    this.buttonClick.emit();
  }

  get buttonStyles() {
    return {
      '--p-button-primary-background': this.bgColor,
      '--p-button-primary-hover-background': this.bgColorHover,
      '--p-button-primary-active-background': this.bgColorActive,

      '--p-button-primary-border-color': this.bgColor,
      '--p-button-primary-hover-border-color': this.bgColorHover,
      '--p-button-primary-active-border-color': this.bgColorActive,

      '--p-button-primary-color': this.textColor,
      '--p-button-primary-hover-color': this.textColorHover,
      '--p-button-primary-active-color': this.textColorActive,

      'font-family': 'Roboto',
      'font-size': '20px',
      'font-weight': '400'
    };
  }
}
