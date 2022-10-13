import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {ChartConfiguration, ChartItem, registerables} from 'node_modules/chart.js';
import Chart from 'chart.js/auto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-modul-transaction-chart',
  templateUrl: './modul-transaction-chart.component.html',
  styleUrls: ['./modul-transaction-chart.component.scss']
})
export class ModulTransactionChartComponent implements AfterViewInit  {

  canvas: any;
  ctx: any;
  @ViewChild('pieCanvas') pieCanvas!: { nativeElement: any };
  pieChart: any;
  data: any;

  constructor(
    public transactionService: TransactionService,
  ) { }

  ngAfterViewInit(): void {
    this.pieChartBrowser();
  }

  //get list transactions
  // getTransactions() {
  //   this.transactionService.getTransactions().subscribe(
  //     res =>{
  //       res.reverse();
        
  //     },
  //     err => console.log(err)
  //   )
  // }

  pieChartBrowser(): void {
    this.canvas = this.pieCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.pieChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['Comida', 'Compras', 'Prestamos'],
        datasets: [
          {
            backgroundColor: [
              '#776AFF',
              '#40E8BF',
              '#FB959C',
              '#FBE387',
              '#9DCEFD',
              '#606060',
            ],
            data: [12, 19, 3],
          },
        ],
      },
    });
  }

}
