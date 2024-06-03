import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-charts-test',
  templateUrl: './charts-test.component.html',
  styleUrls: ['./charts-test.component.css']
})
export class ChartsTestComponent {
  /* Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3,4,5,6,7,8,9,10],
      type: 'pie'
    }]
  }; */
  // Define the series data
  Highcharts: typeof Highcharts = Highcharts;
  seriesData: SeriesOptionsType[] = [{
    type: 'pie', // Specify the type of series
    name: 'Percentage',
    data: [
      { name: 'Resume', y: 30 },
      { name: 'Cover Letter', y: 30 },
      { name: 'Bill', y: 30 },
      { name: 'Test', y: 10 }
    ]
  }];
chartOptions: Highcharts.Options = {
  chart: {
    type: 'pie'
  },
  title: {
    text: 'My Custom Pie Chart'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        distance: -40, // Position data labels inside the pie slices
        format: '{point.percentage:.1f} %',
        style: {
          fontSize: '1.2em',
          textOutline: 'none',
          opacity: 0.7
        },
      },
      showInLegend: true, // Show name in legend
    }
  },
  
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' // Display percentage in tooltips
  },
  series: this.seriesData // Assign series data to the series property
};



}
