
import {  Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../../../components/mathjax.directive';


@Component({
  selector: 'app-subtopic1',
  imports: [MatCardModule, MathJaxDirective, MatButtonModule],
  templateUrl: './subtopic1.html',
  styleUrl: './subtopic1.css',
})
export class Subtopic1 {

}
