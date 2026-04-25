import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";

@Component({
  selector: 'app-dynamic-search-bar',
  imports: [IconFieldModule, InputIconModule, CommonModule],
  templateUrl: './dynamic-search-bar.html',
  styleUrl: './dynamic-search-bar.scss',
})
export class DynamicSearchBar {
  @Input() placeholder: string = 'Pesquisar...'

  @Input() width: string = '280px'
  @Input() height: string = '40px'

  @Input() bgColor: string = 'rgba(255,255,255,0.05)'
  @Input() borderColor: string = 'rgba(255,255,255,0.2)'
  @Input() textColor: string = '#ffffff'
  @Input() placeholderColor: string = 'rgba(255,255,255,0.6)'

  get containerStyles() {
    return {
      width: this.width,
      height: this.height,
      background: this.bgColor,
      border: `1px solid ${this.borderColor}`,
      'border-radius': '999px',
      display: 'flex',
      'align-items': 'center',
      padding: '0 16px',
      'backdrop-filter': 'blur(10px)'
    };
  }

  get inputStyles() {
    return {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: this.textColor,
      'font-size': '14px'
    };
  }

  get iconStyles() {
    return {
      color: this.placeholderColor,
      'font-size': '16px',
      cursor: 'pointer'
    };
  }
}
