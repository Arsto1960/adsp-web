import {  Component,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';



@Component({
  selector: 'app-subtopic121',
 imports: [MatCardModule, MatButtonModule, MathJaxDirective],
  templateUrl: './subtopic121.html',
  styleUrl: './subtopic121.css',
     schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class Subtopic121 {

}
