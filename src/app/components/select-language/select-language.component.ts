import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

interface Language {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

  languages: any[] = [
    {value: 'es', viewValue: 'Español'},
    {value: 'en', viewValue: 'English'}
  ];
  languageStorage: string = "es";
  img: string = "../../../assets/img/";
  img2: string = "../../../assets/img/";

  constructor(
    private _translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    //get item language localstorage
    if (localStorage.getItem('language')) {
      switch (localStorage.getItem('language')) {
        case "es":
          this.languageStorage = "es"
          this.img += "es.png"
          break;
        case "en":
          this.languageStorage = "en"
          this.img += "en.png"
          break;
      }
      this._translocoService.setActiveLang(this.languageStorage);
    } else {
      this._translocoService.setActiveLang(this.languageStorage);
      this.img += "es.png"
    }
  }

  //change language
  changeLanguage(language: any) {
    this.img = "../../../assets/img/" + language + ".png";
    this._translocoService.setActiveLang(language);
    localStorage.setItem('language', language);
  }

}
