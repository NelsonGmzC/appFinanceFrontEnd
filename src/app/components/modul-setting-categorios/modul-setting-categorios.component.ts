import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/transaction';
import { CategoryService } from 'src/app/services/category.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';
import { MatDialog } from '@angular/material/dialog';

import jsonCategoriesIconColor from 'src/assets/categoriesIconColor.json';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-modul-setting-categorios',
  templateUrl: './modul-setting-categorios.component.html',
  styleUrls: ['./modul-setting-categorios.component.scss']
})
export class ModulSettingCategoriosComponent implements OnInit {

  categoryForm! : FormGroup;
  iconSelecTrigger : any;
  colorSelecTrigger : any;
  json : any = jsonCategoriesIconColor;
  getListCategories!: any;
  dragItem : boolean = true;
  token = this.parseJwt(localStorage.getItem('token'));

  constructor(
    private formBuilder: FormBuilder,
    public categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.getCategories();

    //validation of form
    this.categoryForm = this.formBuilder.group({
      _id : [''],
      category: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  //get list categories
  getCategories() {
    this.categoryService.getCategories(this.token._id).subscribe(
      res =>{
        this.getListCategories = res;
      },
      err => console.log(err)
    )
  }

  //validate form
  validateForm() {
    if (this.categoryForm.valid) {
      this.addCategory(this.categoryForm.value);
    }
  }

  //edit or create new register of category
  addCategory(form: Category) {
    form.userId = this.token._id;
    
    if ( form._id !== null && form._id !== '') {
      this.categoryService.updateCategory(form).subscribe(
        res => {
          this.getCategories();
          this.categoryForm.reset();
          this.snackMessage(this.translocoSelect("snackMessage.update")!, 'btn_success');
        },
        err => console.log(err)
      )
    } else {
      delete form._id;
      this.categoryService.createCategory(form).subscribe(
        res => {
          this.getCategories();
          this.categoryForm.reset();
          this.snackMessage(this.translocoSelect("snackMessage.create")!, 'btn_success');
        },
        err => console.log(err)
      )
    }
  }

  //edit category selected by id
  editCategory(form: Category) {
    this.iconSelecTrigger = form.icon;
    this.colorSelecTrigger = form.color;
    this.categoryForm.controls['_id'].setValue(form._id);
    this.categoryForm.controls['category'].setValue(form.category);
    this.categoryForm.controls['icon'].setValue(form.icon);
    this.categoryForm.controls['color'].setValue(form.color);
    this.categoryForm.controls['name'].setValue(form.name);
  }

  //delete category selected by id
  deleteCategory(id: string | undefined) {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: '300px',
      data: {
        title: this.translocoSelect("dialog.title.delete")!,
        message: this.translocoSelect("dialog.message.delete")!,
        type: 'btn_danger',
        color: 'text_danger',
        icon: 'fa-circle-exclamation'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res !== undefined) {
        if (res) {
          this.categoryService.deleteCategory(id).subscribe(
            res => {
              this.getCategories();
              this.snackMessage(this.translocoSelect("snackMessage.delete")!, 'btn_danger');
            },
            err => console.log(err)
          )
        }
      }
    });
  }

  //update category
  updateCategories(){
    this.categoryService.updateCategories(this.getListCategories).subscribe(
      res => {
        this.getCategories();
      },
      err => console.log(err)
    )
  }

  //reset form categories
  resetForm() {
    this.categoryForm.reset();
  }

  //drag & drop list categories
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.getListCategories, event.previousIndex, event.currentIndex);
    //let index = this.getListCategories.findIndex((x: { _id: string; }) => x._id === "633d035e53b36d2c25ae66fd");
    this.updateCategories();
    this.dragItem = true;
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

  //decrypt token user id
  parseJwt (token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  //function that return transloco
  translocoSelect(valueKey: string) {
    let respon;
    this.translocoService.selectTranslate(valueKey).subscribe(value => {
      respon = value;
    })
    return respon;
  }

}
