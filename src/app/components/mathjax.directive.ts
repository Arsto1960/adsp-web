import { Directive, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appMathJax]'
})
export class MathJaxDirective implements AfterViewInit, OnChanges {

  @Input('appMathJax') content!: string;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.renderMath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.renderMath();
    }
  }

  private renderMath(): void {
    if (!this.content || !(window as any).MathJax) {
      return;
    }

    // Set the element HTML
    this.el.nativeElement.innerHTML = this.content;

    // Render MathJax
    (window as any).MathJax.typesetPromise([this.el.nativeElement])
      .catch((err: any) => console.error('MathJax typeset error:', err));
  }
}
