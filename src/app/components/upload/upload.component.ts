import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Track } from '../../utils/interfaces/track.interface';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule, 
    MatSelectModule,
    RouterModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  private http=inject(HttpClient);
  public track : Track | null = null;

  uploadForm = new FormGroup <any>({
    name: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),  
  });
  upload(){
      let body ={
        name : this.uploadForm.value.name,
        author : this.uploadForm.value.author,
        url : "await response http.post ftp"
      };

      
      // fetch qui rempli music
      
  };
  selectedFile: any = null;

onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
    const formData = new FormData();
    formData.append("file",this.selectedFile);
    this.http.post("http://localhost:8090/upload",formData).subscribe(data=>{
      console.log(data);
    })
  }
}
