
import {  Component,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';



@Component({
  selector: 'app-subtopic111',
 imports: [MatCardModule, MathJaxDirective, MatButtonModule],
  templateUrl: './subtopic111.html',
  styleUrl: './subtopic111.css',
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class Subtopic111 {

}
