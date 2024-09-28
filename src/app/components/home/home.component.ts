import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Track } from '../../utils/interfaces/track.interface';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from "../upload/upload.component";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private playlist=inject(PlaylistService);
  public gamestatus :boolean=false;
  //Create Playlist in relation with game form
  createPlaylist(){
    let Tracks :Track[]=[];
    let PlaylistTracks : Track[]=[];
    const nbplaylist_track : number=10 ;
    this.playlist.getAllTracks().subscribe(data=>{
      Tracks=data
    });
    while(PlaylistTracks.length<nbplaylist_track){
      let selected=Math.random()*Tracks.length;
      PlaylistTracks.push(Tracks[selected]);
      Tracks.splice(selected,1);
    }
  }
  
}
