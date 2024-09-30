import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CollectionService } from '../../services/collection/collection.service';
import { Category } from '../../utils/interfaces/category.interface';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
  trackName: string = '';
  selectedFile: File | null = null;
  selectedCategory: string | null = null; // Variable pour stocker la catégorie sélectionnée
  collectionId: string | null = null; // Variable pour stocker l'ID de la collection
  categories: Category[] = []; // Tableau pour stocker les catégories
  errorMessages: { trackName?: string; file?: string } = {
    trackName: 'Track name is required.',
    file: ''
  };

  @Output() trackUploaded = new EventEmitter<any>();
  
  // Input pour recevoir l'ID de la collection
  @Input() collectionIdInput: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UploadFormComponent>,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.collectionId = this.collectionIdInput; // Assigner l'ID de la collection à la variable
    this.collectionService.getCategories().subscribe(
      (data) => {
        this.categories = data; // Stocke les catégories récupérées
      },
      (error) => {
        console.error('Error fetching categories:', error);
        alert('Could not load categories.');
      }
    );
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'mp3' && fileExtension !== 'wav') {
        this.errorMessages.file = 'Only MP3 or WAV files are accepted.';
        this.selectedFile = null; // Réinitialiser le fichier sélectionné
      } else {
        this.selectedFile = file;
        this.errorMessages.file = ''; // Réinitialiser le message d'erreur
      }
    } else {
      this.selectedFile = null;
      this.errorMessages.file = 'A file must be selected.';
    }
  }

  async onUpload(): Promise<void> {
    // Vérification des conditions

    console.log('Collection ID:', this.collectionId);
    if (!this.trackName) {
      alert('Track name is required.');
      return;
    }

    if (!this.selectedFile) {
      alert('A file must be selected.');
      return;
    }

    if (!this.selectedCategory) {
      alert('Please select a category.');
      return;
    }

    const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'mp3' && fileExtension !== 'wav') {
      alert('Only MP3 or WAV files are accepted.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.trackName);
    formData.append('categoryId', this.selectedCategory); // Ajoute l'ID de la catégorie sélectionnée
    formData.append('collectionId', this.collectionId!); // Ajoute l'ID de la collection

    console.log(formData);
    try {
      const response = await fetch('http://localhost:8090/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      this.trackUploaded.emit(data);
      this.dialogRef.close();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error during file upload.');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
