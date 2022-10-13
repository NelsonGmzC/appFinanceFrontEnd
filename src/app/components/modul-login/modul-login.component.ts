import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modul-login',
  templateUrl: './modul-login.component.html',
  styleUrls: ['./modul-login.component.scss']
})
export class ModulLoginComponent implements OnInit {

  loginForm!: any;
  hide = true;
  token!: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    //validation of form
    this.loginForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required]
    });
  }

  //validate form
  signin() {
    if (this.loginForm.valid) {
      this.authService.singIn(this.loginForm.value).subscribe(
        res => {
          this.token = res;
          localStorage.setItem('token', this.token.token);
          this.router.navigate(['/transaction']);
          // this.loginForm.reset();
          // this.snackMessage('Registro actualizado!', 'btn_success');
        },
        err => console.log(err)
      )
    }
  }

  //function snack
  snackMessage(message: string, type: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 3000,
      panelClass: [type],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

}
