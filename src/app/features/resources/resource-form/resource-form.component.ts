// ========================
// RESOURCE FORM COMPONENT - features/resources/resource-form/resource-form.component.ts
// ========================

import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../../core/services/resource.service';
import { CategoryService } from '../../../core/services/category.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss'],
  styles: [`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    input[type="checkbox"]:checked {
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Drag & Drop animations */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .border-dashed {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class ResourceFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = this.categoryService.getCategories;
  selectedCategory = signal<string>('');
  imagePreview = signal<string>('');
  isEditMode = signal(false);
  isSubmitting = signal(false);
  resourceId: string | null = null;

  // File upload
  uploadMethod = signal<'url' | 'file'>('url');
  uploadedFile = signal<File | null>(null);
  isDragging = signal(false);
  fileError = signal<string>('');
  maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

  resourceForm: FormGroup;
  minDate: string;

  constructor() {
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Initialize form
    this.resourceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      imageUrl: [''],
      expiresAt: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      whatsapp: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

    // Watch image URL changes
    this.resourceForm.get('imageUrl')?.valueChanges.subscribe(url => {
      if (url && this.isValidUrl(url) && this.uploadMethod() === 'url') {
        this.imagePreview.set(url);
      } else if (this.uploadMethod() === 'url') {
        this.imagePreview.set('');
      }
    });
  }

  ngOnInit(): void {
    // Check if editing
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.resourceId = params['id'];
        this.isEditMode.set(true);
        this.loadResource(params['id']);
      }
    });

    // Pre-fill user contact if authenticated
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.resourceForm.patchValue({
        contactEmail: currentUser.email,
        whatsapp: currentUser.whatsapp
      });
    }
  }

  loadResource(id: string): void {
    const resource = this.resourceService.getResourceById(id);
    if (resource) {
      this.resourceForm.patchValue({
        title: resource.title,
        category: resource.category,
        description: resource.description,
        location: resource.location,
        imageUrl: resource.imageUrl || '',
        expiresAt: resource.expiresAt ? new Date(resource.expiresAt).toISOString().split('T')[0] : '',
        contactEmail: resource.author.contact,
        whatsapp: resource.author.whatsapp || ''
      });
      this.selectedCategory.set(resource.category);
      
      if (resource.imageUrl) {
        this.imagePreview.set(resource.imageUrl);
      }
    } else {
      this.notificationService.error('Ressource introuvable');
      this.router.navigate(['/resources']);
    }
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.resourceForm.patchValue({ category: categoryId });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resourceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // File Upload Methods
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    this.fileError.set('');

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.fileError.set('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      this.fileError.set(`Fichier trop volumineux. Maximum ${this.maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    // File is valid
    this.uploadedFile.set(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.imagePreview.set(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    this.notificationService.success('Image chargée avec succès');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onImageError(): void {
    this.imagePreview.set('');
    this.notificationService.warning('Impossible de charger l\'image');
  }

  clearImage(): void {
    this.resourceForm.patchValue({ imageUrl: '' });
    this.imagePreview.set('');
    this.uploadedFile.set(null);
    this.fileError.set('');
    
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.resourceForm.controls).forEach(key => {
        this.resourceForm.get(key)?.markAsTouched();
      });
      this.notificationService.error('Veuillez remplir tous les champs requis');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.resourceForm.value;
    
    // Get image URL (from URL input or uploaded file)
    let imageUrl = formValue.imageUrl;
    if (this.uploadMethod() === 'file' && this.uploadedFile()) {
      // In real app, upload to server and get URL
      // For now, use the base64 preview
      imageUrl = this.imagePreview();
    }

    const resourceData = {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category as 'don' | 'service' | 'echange' | 'aide',
      location: formValue.location,
      imageUrl: imageUrl || undefined,
      expiresAt: formValue.expiresAt ? new Date(formValue.expiresAt) : undefined,
      author: {
        name: this.userService.getCurrentUser()?.name || 'Utilisateur',
        contact: formValue.contactEmail,
        whatsapp: formValue.whatsapp || undefined
      },
      status: 'disponible' as const
    };

    // Simulate API call
    setTimeout(() => {
      if (this.isEditMode() && this.resourceId) {
        this.resourceService.updateResource(this.resourceId, resourceData);
        this.notificationService.success('Annonce mise à jour avec succès');
      } else {
        this.resourceService.addResource(resourceData);
        this.notificationService.success('Annonce publiée avec succès');
      }

      this.isSubmitting.set(false);
      this.router.navigate(['/resources']);
    }, 1500);
  }

  onCancel(): void {
    if (this.resourceForm.dirty || this.uploadedFile()) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.router.navigate(['/resources']);
      }
    } else {
      this.router.navigate(['/resources']);
    }
  }
}