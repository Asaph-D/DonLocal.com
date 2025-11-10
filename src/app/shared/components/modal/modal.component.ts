// ========================
// MODAL COMPONENT - shared/components/modal/modal.component.ts
// ========================

import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        (click)="onBackdropClick($event)">
        
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Container -->
        <div 
          class="relative bg-zinc-900 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
          [class.max-w-sm]="size === 'sm'"
          [class.max-w-2xl]="size === 'md'"
          [class.max-w-4xl]="size === 'lg'"
          [class.max-w-6xl]="size === 'xl'"
          (click)="$event.stopPropagation()">
          
          <!-- Header -->
          @if (title || showCloseButton) {
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10">
              @if (title) {
                <h3 class="text-2xl font-light text-white tracking-wide">
                  {{ title }}
                </h3>
              }
              @if (showCloseButton) {
                <button 
                  (click)="close()"
                  class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded"
                  aria-label="Fermer">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div 
            class="px-8 py-6 overflow-y-auto"
            [style.max-height]="contentMaxHeight">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="px-8 py-6 border-t border-white/10 flex items-center justify-end space-x-4">
              @if (showCancelButton) {
                <button 
                  (click)="onCancel()"
                  class="px-6 py-2.5 border border-white/20 text-white hover:bg-white/5 transition-all text-sm tracking-wide">
                  {{ cancelText }}
                </button>
              }
              @if (showConfirmButton) {
                <button 
                  (click)="onConfirm()"
                  [disabled]="confirmDisabled"
                  class="px-6 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all text-sm font-medium tracking-wide">
                  {{ confirmText }}
                </button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes scale-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }

    .animate-scale-in {
      animation: scale-in 0.3s ease-out;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showCloseButton: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() showConfirmButton: boolean = true;
  @Input() cancelText: string = 'ANNULER';
  @Input() confirmText: string = 'CONFIRMER';
  @Input() confirmDisabled: boolean = false;
  @Input() closeOnBackdropClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() contentMaxHeight: string = '60vh';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick) {
      this.close.emit();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }
}