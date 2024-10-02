import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TrackService } from '../../services/track/track.service'; // Importer le service TrackService
import { Characteristic } from '../../utils/interfaces/characteristic.interface'; 
import { Answer } from '../../utils/interfaces/answer.interface';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {
  @Input() trackId: number | null = null; 
  @Output() characteristicAdded = new EventEmitter<Answer>();

  characteristics: (Characteristic & { isDeleting?: boolean })[] = [];
  allCharacteristics: Characteristic[] = [];
  selectedCharacteristicId: number | null = null;
  newValue: string = '';

  constructor(
    private trackService: TrackService, // Utiliser TrackService
    public dialogRef: MatDialogRef<AnswerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trackId: number }
  ) {
    this.trackId = data.trackId; 
  }

  ngOnInit(): void {
    if (this.trackId) {
      this.fetchCharacteristics();
      this.fetchAllCharacteristics();
    }
  }

  fetchCharacteristics() {
    this.trackService.getCharacteristics(this.trackId!).subscribe((data) => {
        this.characteristics = data.map(item => ({
            id: item.id, 
            name: item.name, // Assurez-vous que cela correspond à votre interface
            value: item.value || '', 
        }));
    }, (error) => {
        console.error('Error fetching characteristics:', error);
    });
    }

  fetchAllCharacteristics() {
    this.trackService.getAllCharacteristics().subscribe((data) => {
      this.allCharacteristics = data;
    });
  }

  addCharacteristic() {
    if (!this.selectedCharacteristicId || !this.newValue || !this.trackId) {
      alert('Please select a characteristic, enter a value, and ensure track ID is valid.');
      return;
    }

    const body: Answer = {
      characteristicId: this.selectedCharacteristicId,
      value: this.newValue,
      trackId: this.trackId
    };

    this.trackService.addCharacteristic(body).subscribe((response) => {
      this.characteristicAdded.emit(response);
      this.newValue = '';
      this.selectedCharacteristicId = null;
      this.fetchCharacteristics(); 
    }, (error) => {
      console.error(error);
      alert('Error adding characteristic.');
    });
  }

  deleteCharacteristic(characteristicId: number) {
    if (this.characteristics.length <= 1) {
      alert('Vous devez garder au moins une réponse dans cette piste.');
      return;
    }

    const characteristicToRemove = this.characteristics.find(c => c.id === characteristicId);
    if (characteristicToRemove) {
      characteristicToRemove.isDeleting = true;

      setTimeout(() => {
        this.trackService.deleteCharacteristic(this.trackId!, characteristicId).subscribe((response) => {
          this.characteristics = this.characteristics.filter(c => c.id !== characteristicId);
        }, (error) => {
          console.error('Error deleting characteristic:', error);
          alert('Error deleting characteristic.');
        });
      }, 300); // Durée de l'animation
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
