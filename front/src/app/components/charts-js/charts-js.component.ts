import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DocumentService } from 'src/app/services/document.service';



@Component({
  selector: 'app-charts-js',
  templateUrl: './charts-js.component.html',
  styleUrls: ['./charts-js.component.css']
})
export class ChartsJsComponent implements AfterViewInit,OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('columnContainer', { static: false }) columnContainer!: ElementRef;
  constructor(private documentService:DocumentService){}


  //data:any

  ngOnInit(): void {
      this.documentService.getDocumentTypeRepartition().subscribe({
        next:(res:any)=>{
          console.log("res",res)
          //this.data=res
          this.createChart(res);
          /* this.createColumn() */
        }

      })
      this.documentService.getDocumentValidationProgress().subscribe({
        next:(res:any)=>{
          console.log("res",res)
          //this.data=res
          //this.createChart();
          this.createColumn(res) 
        }

      })
  }

  ngAfterViewInit(): void {
    
  }
  createChart(data:any): void {
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Document Type Repartition'
      },
      tooltip: {
        valueSuffix: '%'
      },
     
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            }
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Percentage',
        data:data
      }]
    };

    Highcharts.chart(this.chartContainer.nativeElement, chartOptions);
  }

  createColumn(data:any) {
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Document Validation Progress Statistics',
        align: 'left'
      },
      xAxis: {
        categories: data.categories,
        crosshair: true,
        accessibility: {
          description: 'Countries'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total'
        }
      },
      tooltip: {
        valueSuffix: ' (Documents)'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Done',
          type: 'column',
          data: data.done
        },
        {
          name: 'In Progress',
          type: 'column',
          data: data.inprogress
        }
      ]
    };
  
    Highcharts.chart(this.columnContainer.nativeElement, chartOptions);
  }

  /* series: [
    {
      name: 'Done',
      type: 'column',
      data: [1, 2, 3, 4,5]
    },
    {
      name: 'In Progress',
      type: 'column',
      data: [5, 4,3, 2,1]
    }
  ] */
}
