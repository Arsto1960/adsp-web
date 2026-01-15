
import {  Component,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';




@Component({
  selector: 'app-subtopic81',
 imports: [MatCardModule, MathJaxDirective, MatButtonModule],
  templateUrl: './subtopic81.html',
  styleUrl: './subtopic81.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class Subtopic81 {

}
