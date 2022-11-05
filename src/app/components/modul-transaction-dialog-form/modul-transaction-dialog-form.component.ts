import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Transaction } from 'src/app/models/transaction';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { LabelService } from 'src/app/services/label.service';

@Component({
  selector: 'app-modul-transaction-dialog-form',
  templateUrl: './modul-transaction-dialog-form.component.html',
  styleUrls: ['./modul-transaction-dialog-form.component.scss']
})

export class ModulTransactionDialogFormComponent implements OnInit {
  
  //varibles
  transactionForm! : FormGroup;
  toppingsLabels : string[] = [];
  toppingListLabels : string[] = [];
  coins : select[] = [
    {value: 'COP', viewValue: 'COP'},
    {value: 'US', viewValue: 'US'}
  ];
  categoriesOptional = [
    {
      category: "Gasto",
      color: "#fab9bf",
      icon: "fa-arrow-up",
      name: "Gasto"
    },
    {
      category: "Ingreso",
      color: "#a8d8ba",
      icon: "fa-arrow-down",
      name: "Ingreso"
    }
  ];
  labelOptional: string[] = [
    "Gasto",
    "Ingreso"
  ]
  category : string = "0";
  getListCategories! : any;
  iconSelecTrigger! : string;
  colorSelecTrigger! : string;
  textSelecTrigger! : string;
  token = this.parseJwt(localStorage.getItem('token'));

  constructor(
    public categoryService: CategoryService,
    public labelService: LabelService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModulTransactionDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getLabels();

    //validation of form
    this.transactionForm = this.formBuilder.group({
      _id : [''],
      category: [this.category],
      categoryOpc : ['', Validators.required],
      date : ['', Validators.required],
      notes : [''], 
      labels : [''],
      amoint : ['', Validators.required],
      coin : ['COP', Validators.required],
      img : ['']
    });

    if (this.data) {
      this.toppingsLabels = this.data.labels;
      this.category = this.data.category;
      this.textSelecTrigger = this.data.categoryOpc;
      this.transactionForm.controls['_id'].setValue(this.data._id);
      this.transactionForm.controls['categoryOpc'].setValue(this.data.categoryOpc);
      this.transactionForm.controls['date'].setValue(this.data.date);
      this.transactionForm.controls['notes'].setValue(this.data.notes);
      this.transactionForm.controls['labels'].setValue(this.data.labels);
      this.transactionForm.controls['amoint'].setValue(this.data.amoint);
      this.transactionForm.controls['coin'].setValue(this.data.coin);
      this.transactionForm.controls['img'].setValue(this.data.img);
      setTimeout(()=>{       
        for (let category of this.getListCategories) {
          if (category.name === this.data.categoryOpc) {
            this.iconSelecTrigger = category.icon;
            this.colorSelecTrigger = category.color;
          }
        }
      }, 500);
    }
  }

  //get list labels
  getLabels() {
    this.labelService.getLabels(this.token._id).subscribe(
      res =>{
        if (res.length !== 0) {
          if (res[0].labels.length !== 0) {
            this.toppingListLabels = res[0].labels;
          } else {
            this.toppingListLabels = this.labelOptional;
          }
        }
      },
      err => console.log(err)
    )
  }

  //get list transactions
  getCategories() {
    this.categoryService.getCategories(this.token._id).subscribe(
      res =>{
        if (res.length !== 0) {
          this.getListCategories = res;
        } else {
          this.getListCategories = this.categoriesOptional;
        }
      },
      err => console.log(err)
    )
  }

  //submit response at modul-transaction
  addTransaction() {
    if (this.transactionForm.valid) {
      this.transactionForm.value.category = this.category;
      this.dialogRef.close(this.transactionForm.value);
    }
  }

  //close modal
  closeModal(): void {
    this.dialogRef.close();
  }

  showSelectValue(mySelect: string[]) {
    this.toppingsLabels=mySelect;
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

}
