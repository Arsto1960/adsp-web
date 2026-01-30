import {  Component,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';




@Component({
  selector: 'app-subtopic124',
 imports: [MatCardModule, MatButtonModule, MathJaxDirective],
  templateUrl: './subtopic124.html',
  styleUrl: './subtopic124.css',
     schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class Subtopic124 {

}
