import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modul-setting',
  templateUrl: './modul-setting.component.html',
  styleUrls: ['./modul-setting.component.scss']
})
export class ModulSettingComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.navigate(['/app/setting/categories']);
  }

}
