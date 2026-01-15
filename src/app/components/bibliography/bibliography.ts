import { ChangeDetectionStrategy, Component , signal} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';  




@Component({
  selector: 'app-bibliography',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule],
  templateUrl: './bibliography.html',
  styleUrl: './bibliography.css',
})
export class Bibliography {

}
