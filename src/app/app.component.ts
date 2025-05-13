import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateLangService } from './core/services/translate.service';

@Component({
  selector: 'ma-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  translation = inject(TranslateLangService);

  ngOnInit() {
    this.translation.resloveTranslation();
  }
}
