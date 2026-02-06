import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { DashboardService } from 'src/app/pages/dashboard/service/dashboard.service';
@Component({
  selector: 'app-mixed-widget11',
  templateUrl: './mixed-widget11.component.html',
})
export class MixedWidget11Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};

  @Input() year:string = '';
  sales_x_month_of_year:any = null;
  total_sales_year_current:number = 0;
  constructor(
    public dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.salesXMonthOfYear();
  }

  salesXMonthOfYear(){
    let data = {
      year: this.year,
    }
    this.sales_x_month_of_year = null;
    this.dashboardService.salesXMonthOfYear(data).subscribe((resp:any) => {
      console.log(resp);
      var categories_labels:any = [];
      var series_data:any = [];
      this.sales_x_month_of_year = resp;
      this.total_sales_year_current = resp.total_sales_year_current;
      var sales_for_month_year_current:any = [];
      this.sales_x_month_of_year.sales_x_month_of_year_current.forEach((sale_month:any) => {
        sales_for_month_year_current.push(sale_month.total_sales);
      });
      var sales_for_month_year_before:any = [];
      this.sales_x_month_of_year.sales_x_month_of_year_before.forEach((sale_month:any) => {
        sales_for_month_year_before.push(sale_month.total_sales);
      });

      series_data.push({
        name: 'Ventas del año'+this.year,
        data: sales_for_month_year_current,
      })
      series_data.push({
        name: 'Ventas del año'+(parseInt(this.year)-1),
        data: sales_for_month_year_before,
      })
      categories_labels = resp.months_name;
      this.chartOptions = getChartOptions(this.chartHeight, this.chartColor,categories_labels,series_data);
    })
  }

}
function getChartOptions(chartHeight: string, chartColor: string,months_name:any = [],series_data:any = []) {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const secondaryColor = getCSSVariableValue('--bs-gray-300');
  const baseColor = getCSSVariableValue('--bs-' + chartColor);

  return {
    series: series_data,
    // [
    //   {
    //     name: 'Net Profit',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    //   {
    //     name: 'Revenue',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    // ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: months_name,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return val + ' PEN';
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
