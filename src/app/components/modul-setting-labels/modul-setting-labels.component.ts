import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Label } from 'src/app/models/transaction';
import { LabelService } from 'src/app/services/label.service';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-modul-setting-labels',
  templateUrl: './modul-setting-labels.component.html',
  styleUrls: ['./modul-setting-labels.component.scss']
})
export class ModulSettingLabelsComponent implements OnInit {

  //labelForm! : FormGroup;
  getListLabels!: any;
  dragItem : boolean = true;
  textButton : string = 'Crear categoria'
  labelForm = new FormControl('', Validators.required);
  token = this.parseJwt(localStorage.getItem('token'));

  constructor(
    public labelService: LabelService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getLabels();
  }

  //get list labels
  getLabels() {
    this.labelService.getLabels(this.token._id).subscribe(
      res =>{
        if (res.length !== 0) {
          this.getListLabels = res[0];
        } else {
          this.getListLabels = {};
        }
      },
      err => console.log(err)
    )
  }

  //validate form
  validateForm() {
    if (this.labelForm.valid) {
      if ( Object.entries(this.getListLabels).length !== 0 ) {
        this.getListLabels.labels.push(this.labelForm.value);
        this.addLabel(this.getListLabels);
      } else {
        this.getListLabels.labels = [this.labelForm.value];
        this.getListLabels._id = '';
        this.addLabel(this.getListLabels);
      }
    }
  }

  //edit or create new register of label
  addLabel(form: Label) {
    form.userId = this.token._id;

    if ( form._id !== null && form._id !== '') {
      this.labelService.updateLabel(form).subscribe(
        res => {
          this.getLabels(); 
          this.labelForm.reset();
          this.snackMessage('Registro actualizado!', 'btn_success');
        },
        err => console.log(err)
      )
    } else {
      delete form._id;
      this.labelService.createLabel(form).subscribe(
        res => {
          this.getLabels();
          this.labelForm.reset();
          this.snackMessage('Registro creado!', 'btn_success');
        },
        err => console.log(err)
      )
    }
  }

  //delete label selected by id
  deleteLabel(label: any) {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: '300px',
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete it?',
        type: 'btn_danger',
        color: 'text_danger',
        icon: 'fa-circle-exclamation'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res !== undefined) {
        if (res) {
          const filteredLibraries = this.getListLabels.labels.filter((item: any) => item !== label)
          this.getListLabels.labels = filteredLibraries;

          this.labelService.updateLabel(this.getListLabels).subscribe(
            res => {
              this.getLabels();
              this.snackMessage('Registro Eliminado!', 'btn_danger');
            },
            err => console.log(err)
          )
        }
      }
    });
  }

  //reset form
  resetForm() {
    this.labelForm.reset();
  }

  //drag & drop list labels
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.getListLabels.labels, event.previousIndex, event.currentIndex);
    this.labelService.updateLabel(this.getListLabels).subscribe(
      res => {
        this.getLabels();
      },
      err => console.log(err)
    )
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

}
