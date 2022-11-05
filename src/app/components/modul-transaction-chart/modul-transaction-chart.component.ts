import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { TransactionService } from 'src/app/services/transaction.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modul-transaction-chart',
  templateUrl: './modul-transaction-chart.component.html',
  styleUrls: ['./modul-transaction-chart.component.scss']
})
export class ModulTransactionChartComponent implements AfterViewInit  {

  @Input() listTransactions : any;
  @Input() listCategories : any;
  contentLoaded = false;
  //chart
  backgroundColorEntry : string[ ] = [ ];
  backgroundColorSpent : string[ ] = [ ];
  backgroundColor : string[ ] = [ ];
  dataEntry : number[ ] = [ ];
  dataSpent : number[ ] = [ ];
  data : number[ ] = [ ];
  //chart 02
  dataCurrentBalance : number[ ] = [ ];
  labelDateCurrentBalance : string[ ] = [ ];

  changeChart : string = '0';

  @ViewChild('pieCanvas') pieCanvas! : { nativeElement: any };
  @ViewChild('pieCanvas2') pieCanvas2! : { nativeElement: any };
  canvas : any;
  canvas2 : any;
  ctx : any;
  ctx2 : any;
  pieChart : any;
  pieChart2 : any;

  constructor(
    public transactionService: TransactionService,
  ) { }
  
  //detect changes in the data listCategories & listTransactions
  //infor submit by the component parent 'modul-transaction'
  ngOnChanges(changes: SimpleChanges) {
    this.backgroundColorEntry = [];
    this.backgroundColorSpent = [];
    this.backgroundColor = [];
    this.dataEntry = [];
    this.dataSpent = [];
    this.data = [];
    this.dataCurrentBalance = [];
    this.labelDateCurrentBalance = [];
    if(this.listCategories !== undefined && this.listTransactions !== undefined) {
      for (let i = 0; i < this.listCategories.length; i++) {
        let counts = 0;
        for (let j = 0; j < this.listTransactions.length; j++) {
          if(this.listCategories[i].name === this.listTransactions[j].categoryOpc) {
            counts = counts + 1;
          }
        }
        if (this.listCategories[i].category === '1') {
          this.dataEntry.push(counts);
          this.backgroundColorEntry.push(this.listCategories[i].color);
        } else {
          this.dataSpent.push(counts);
          this.backgroundColorSpent.push(this.listCategories[i].color);
        }
        this.data = this.dataSpent;
        this.backgroundColor = this.backgroundColorSpent;
        this.listCategories[i].countsTrans = counts;
      }
      setTimeout(()=>{  
        this.ngAfterViewInit();
      }, 100);
      for (let i = 0; i < 8; i++) {
        let date = moment(this.listTransactions[i].date).format("l")
        this.dataCurrentBalance.push(this.listTransactions[i].amoint);
        this.labelDateCurrentBalance.push(date);
      }
    }
    this.contentLoaded = false; 
  }

  //reser component chart js
  ngAfterViewInit(): void {
    if (this.pieChart !== undefined) {
      this.pieChart.destroy();
      this.pieChart2.destroy();
    }
    this.pieChartBrowser();
    this.pieChartBrowser2();
      
  }

  ngOnInit(): void { 
    this.contentLoaded = true;  
  }

  //create chart js
  pieChartBrowser(): void {
    this.canvas = this.pieCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.pieChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            backgroundColor: this.backgroundColor,
            data: this.data,
            borderWidth: 0
          }
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });
  }

  //create chart js
  pieChartBrowser2(): void {
    this.canvas2 = this.pieCanvas2.nativeElement;
    this.ctx2 = this.canvas2.getContext('2d');
    this.pieChart2 = new Chart(this.ctx2, {
      type: 'line',
      data: {
        labels: this.labelDateCurrentBalance,
        datasets: [
          {
            data: this.dataCurrentBalance,
            fill: true,
            borderColor: 'rgb(119, 106, 225)',
            backgroundColor: 'rgb(119, 106, 225, .1)',
            tension: 0.3,
          }
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          x: {
            grid: {
              //display: false
            }
          },
          y: {
            grid: {
              //display: false
            }
          }
        }
      },
    });
  }

  //changeChart
  changeChartBtn(num: string) {
    this.changeChart = num;
    switch(num) {
      case '0':
        this.data = this.dataSpent;
        this.backgroundColor = this.backgroundColorSpent;
        break;
      case '1':
        this.data = this.dataEntry;
        this.backgroundColor = this.backgroundColorEntry;
        break;
    }
    this.ngAfterViewInit();
  }

}
