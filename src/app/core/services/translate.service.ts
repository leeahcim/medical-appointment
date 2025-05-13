import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const LANGUAGES = ['en', 'sk'];
export const DEFAULT_LANGUAGE = 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslateLangService {
  translate = inject(TranslateService);
  activeLang = signal<string>(DEFAULT_LANGUAGE);

  switchLanguage(lang: string) {
    this.activeLang.set(lang);
    this.translate.use(lang);
  }

  resloveTranslation(): void {
    this.translate.addLangs(LANGUAGES);
    const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];

    // Get the current browser language, if included set it
    const defaultLang = this.translate.getLangs().includes(browserLang)
      ? browserLang
      : DEFAULT_LANGUAGE;

    // Set the default and current language
    this.translate.setDefaultLang(defaultLang);
  }
}
