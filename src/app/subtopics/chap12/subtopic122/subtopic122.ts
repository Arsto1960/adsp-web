import {  Component,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';



@Component({
  selector: 'app-subtopic122',
 imports: [MatCardModule, MatButtonModule, MathJaxDirective],
  templateUrl: './subtopic122.html',
  styleUrl: './subtopic122.css',
     schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class Subtopic122 {

}
