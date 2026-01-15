
import { ChangeDetectionStrategy, Component , signal} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';  
import { MathJaxDirective } from '../mathjax.directive';
import { Id1 } from '../../subtopics/chap1/id1/id1';




@Component({
  selector: 'app-chapter1',
  
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective, Id1],
  templateUrl: './chapter1.html',
  styleUrl: './chapter1.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chapter1 {
  readonly panelOpenState = signal(false);


questions = [
    {
      text: '1️⃣ Which of the following is the best description of a “signal”?',
      options: [
        'A. Any physical quantity that changes over time and can carry information',
        'B. Only audio captured by a microphone',
        'C. Any static constant value',
        'D. Only electromagnetic waves'
      ],
      correctAnswer: 'A. Any physical quantity that changes over time and can carry information',
      selectedAnswer: null,
      isSubmitted: false
    },
    {
      text: '2️⃣ What does “digital” refer to in digital signal processing?',
      options: [
        'A. Making the signal louder',
        'B. Converting the signal to a set of discrete samples and discrete amplitude levels',
        'C. Only visualizing the signal on a computer',
        'D. Saving it as an MP3'
      ],
      correctAnswer: 'B. Converting the signal to a set of discrete samples and discrete amplitude levels',
      selectedAnswer: null,
      isSubmitted: false
    },
    {
      text: '3️⃣ Why do we treat acoustic signals in a special way compared to generic DSP?',
      options: [
        'A. Because acoustic signals are the only real signals',
        'B. Because sound is easy and noise-free',
        'C. Because human hearing and room acoustics matter, so perception and spatial information are important',
        'D. Because audio never needs compression'
      ],
      correctAnswer: 'C. Because human hearing and room acoustics matter, so perception and spatial information are important',
      selectedAnswer: null,
      isSubmitted: false
    }
  ];

  submitAnswer(question: any) {
    question.isSubmitted = true;
  }

  
 tryAgain(question: any) {
    question.isSubmitted = false;
    question.selectedAnswer = null;
  }
}












