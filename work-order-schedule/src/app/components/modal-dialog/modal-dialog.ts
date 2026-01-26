import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onBackdropClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button 
            *ngIf="type === 'confirm'" 
            class="btn secondary" 
            (click)="onCancel()">
            Cancel
          </button>
          <button 
            [class]="type === 'confirm' ? 'btn primary' : 'btn primary'" 
            (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './modal-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'alert' | 'confirm' = 'alert';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(): void {
    if (this.type === 'alert') {
      this.onConfirm();
    }
  }
}
