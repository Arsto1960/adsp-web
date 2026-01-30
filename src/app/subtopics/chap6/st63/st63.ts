import {  Component ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-st63',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './st63.html',
  styleUrl: './st63.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class St63 {

}
