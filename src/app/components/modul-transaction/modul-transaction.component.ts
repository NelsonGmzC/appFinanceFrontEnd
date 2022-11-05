import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from 'src/app/services/category.service';
import { Transaction } from 'src/app/models/transaction';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModulTransactionDialogFormComponent } from '../modul-transaction-dialog-form/modul-transaction-dialog-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-modul-transaction',
  templateUrl: './modul-transaction.component.html',
  styleUrls: ['./modul-transaction.component.scss']
})

export class ModulTransactionComponent implements OnInit {
  //[x: string]: any;

  //varibles
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  //@ViewChild('tableLoaded2') table! : ElementRef;
  @ViewChild('exporter') exporter: any;
  transactionDialog : any;
  displayedColumns : any[] = [
    'category',
    'date',
    'notes',
    'labels',
    'amoint',
    'coin',
    //'img',
    'action'
  ];
  dataSource! : MatTableDataSource<any>;
  totalSpent : number = 0;
  totalEntry : number = 0;
  total : number = 0;
  getListCategories! : any;
  getListTransaction! : any;
  token = this.parseJwt(localStorage.getItem('token'));
  messageTransloco!: string;
  contentLoaded = false;
  myBgColor = '#9DCEFD'
  // exporter: any;

  constructor(
    public transactionService: TransactionService,
    public categoryService: CategoryService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.getTransactions();
    this.getCategories();  
    this. contentLoaded = true;  
  }

  //total of spent & entry
  totalMoney(res: Transaction[]){
    for (let data of res) {
      if (data.category === '0') {
        this.totalSpent = this.totalSpent + data.amoint;
      } else if (data.category === '1') {
        this.totalEntry = this.totalEntry + data.amoint;
      }
    }
    this.total = this.totalEntry - this.totalSpent;
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

  //get list transactions
  getTransactions() {
    this.transactionService.getTransactions(this.token._id).subscribe(
      res =>{
        res.reverse();
        this.totalMoney(res);
        this.getListTransaction = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this. contentLoaded = false;
      },
      err => console.log(err)
    )
  }

  //edit or create new register of transaction
  addTransaction(form: Transaction) {
    form.userId = this.token._id;

    if ( form._id !== '' ) {
      this.transactionService.updateTransaction(form).subscribe(
        res => {
          this.getTransactions();
          this.snackMessage(this.translocoSelect('snackMessage.update')!, 'btn_success');
        },
        err => console.log(err)
      )
    } else {
      delete form._id;
      this.transactionService.createTransaction(form).subscribe(
        res => {
          this.getTransactions();
          this.snackMessage(this.translocoSelect('snackMessage.create')!, 'btn_success');
        },
        err => console.log(err)
      )
    }
  }

  //edit transaction selected by id
  editTransaction(transaction: Transaction) {
    const dialogRef = this.dialog.open(ModulTransactionDialogFormComponent, {
      width: '500px',
      data: transaction
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res !== undefined) {
        this.addTransaction(res);
      }
    });
  }

  //delete transaction selected by id
  deleteTransaction(id: string | undefined){
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: '300px',
      data: {
        title: this.translocoSelect('dialog.title.delete'),
        message: this.translocoSelect('dialog.message.delete'),
        type: 'btn_danger',
        color: 'text_danger',
        icon: 'fa-circle-exclamation'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res !== undefined) {
        if (res) {
          this.transactionService.deleteTransaction(id).subscribe(
            res => {
              this.getTransactions();
              this.snackMessage(this.translocoSelect('snackMessage.delete')!, 'btn_danger');
            },
            err => console.log(err)
          )
        }
      }
    });
  }

  //filter of search of the tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //open dialog form transaction
  openDialog(){
    const dialogRef = this.dialog.open(ModulTransactionDialogFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res !== undefined) {
        this.addTransaction(res);
      }
    });
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

  //function that return transloco
  translocoSelect(valueKey: string) {
    let respon;
    this.translocoService.selectTranslate(valueKey).subscribe(value => {
      respon = value;
    })
    return respon;
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
