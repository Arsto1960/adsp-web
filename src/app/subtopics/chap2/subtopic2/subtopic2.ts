import {  Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../../../components/mathjax.directive';



@Component({
  selector: 'app-subtopic2',
  imports: [MatCardModule, MathJaxDirective, MatButtonModule],  templateUrl: './subtopic2.html',
  styleUrl: './subtopic2.css',
})
export class Subtopic2 {

}
