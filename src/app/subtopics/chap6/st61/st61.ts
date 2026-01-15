import {  Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../../../components/mathjax.directive';




@Component({
  selector: 'app-st61',
  imports: [MatCardModule, MathJaxDirective, MatButtonModule],
  templateUrl: './st61.html',
  styleUrl: './st61.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class St61 {

}
