import {  Component ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-st62',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './st62.html',
  styleUrl: './st62.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class St62 {

}
