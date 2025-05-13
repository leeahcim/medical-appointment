
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'ma-page-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    CommonModule,
    HeaderComponent
],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PageLayoutComponent {
}
