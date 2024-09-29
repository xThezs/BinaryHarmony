import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CollectionListComponent } from '../collection-list/collection-list.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    NavbarComponent,
    CollectionListComponent
  ]
})
export class CollectionComponent {

  constructor(public dialog: MatDialog) {}

  openCollectionForm(): void {
    const dialogRef = this.dialog.open(CollectionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Collection créée:', result);
      }
    });
  }
}