import { Directive, HostListener, NgModule } from '@angular/core';

@Directive({
  selector: '[appImageOnError]',
})
export class HideImageOnErrorDirective {
  @HostListener('error', ['$event'])
  handleError(event: ErrorEvent): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}

@NgModule({
  exports: [HideImageOnErrorDirective],
  declarations: [HideImageOnErrorDirective],
})
export class HideImageOnErrorDirectiveModule {}
