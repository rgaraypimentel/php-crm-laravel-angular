import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { DashboardService } from './service/dashboard.service';

declare var KTUtil:any;
declare var KTThemeMode:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  sucursale_deliveries:any = [];
  year:string = '';
  month:string = '';
  sucursale_deliverie_id:string = '';
  isLoading$:any = null;
  year_2:string = '';
  month_2:string = '';
  year_3:string = '';
  month_3:string = '';
  sucursale_deliverie_id_2:string = '';
  year_4:string = '';
  month_4:string = '';
  year_5:string = '';
  month_5:string = '';
  //
  sucursal_most_sales:any;
  total_sales:number = 0;
  total_purchase:number = 0;
  total_clients:number = 0;
   //
  sales_x_sucursales:any = null;
  sales_total_x_sucursales:number = 0;
  percentage_sales_sucursales:number = 0;

  sales_x_day_month:any = null;
  sales_total_x_day_month:number =0 ;
  sales_total_before_x_day_month:number =0 ;
  percentage_sales_x_day_month:number = 0;

  sales_x_segment_client:any = null;
  sales_total_x_segment_client:number = 0;

  asesor_most_sales:any = null;
  asesor_total_most_sales:number = 0;
  asesor_percentage_v_most_sales:number = 0;

  categories_most_sales:any = null;
  list_categories:any = [];
  products_x_categories:any = [];
  option_selected:string = '';
  constructor(
    public dashboardService: DashboardService,
  ) {}

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  this.isLoading$ = this.dashboardService.isLoading$;
    this.dashboardService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.year = resp.year;
      this.month = resp.month;
      this.sucursale_deliveries = resp.sucursale_deliveries;
      this.year_2 = resp.year;
      this.month_2 = resp.month;
      this.year_3 = resp.year
      this.month_3 = resp.month;
      this.year_4 = resp.year;
      this.month_4 = resp.month;
      this.year_5 = resp.year;
      this.month_5 = resp.month;
      this.salesXSucursales();
      this.salesXDayMonth();
      this.salesXSegmentClient();
      this.salesXAsesor();
      this.salesXCategorias();
    })

  }

  isLoadingProcess(){
    this.dashboardService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.dashboardService.isLoadingSubject.next(false);
    }, 50);
  }

  informationGeneral(){
  let data = {
      year: this.year,
      month: this.month,
    }
    this.dashboardService.informationGeneral(data).subscribe((resp:any) => {
        console.log(resp);
        this.sucursal_most_sales = resp.sucursal_most_sales;
        this.total_sales = resp.total_sales;
        this.total_purchase = resp.total_purchase;
        this.total_clients = resp.total_clients;
    })
  }

  salesXSucursales(){
  let data = {
    year: this.year,
    month: this.month,
  }
  this.sales_x_sucursales = null;
  this.dashboardService.salesXSucursales(data).subscribe((resp:any) => {
      console.log(resp);
      this.informationGeneral();
      this.sales_x_sucursales = resp.sale_sucursales;
      this.sales_total_x_sucursales = resp.total_sale_sucursales;
      this.percentage_sales_sucursales = resp.percentageV;

      let series_data:any = [];
      let categories_labels:any = [];
      this.sales_x_sucursales.forEach((sucursale:any) => {
        series_data.push(sucursale.total_sales);
        categories_labels.push(sucursale.sucursale_name.replace("Sucursal", 'S.'));
      });
      // *
      var KTChartsWidget27 = function() {
          var e:any = {
                self: null,
                rendered: !1
            },
            t = function(e:any) {
                var t = document.getElementById("kt_charts_widget_27");
                if (t) {
                      var a = KTUtil.getCssVariableValue("--bs-gray-800"),
                        l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                        r = {
                            series: [{
                                  name: "Ventas",
                                  data: series_data,//[12.478, 7.546, 6.083, 5.041, 4.42]
                            }],
                            chart: {
                                  fontFamily: "inherit",
                                  type: "bar",
                                  height: 350,
                                  toolbar: {
                                    show: !1
                                  }
                            },
                            plotOptions: {
                                  bar: {
                                    borderRadius: 8,
                                    horizontal: !0,
                                    distributed: !0,
                                    barHeight: 50,
                                    dataLabels: {
                                        position: "bottom"
                                    }
                                  }
                            },
                            dataLabels: {
                                  enabled: !0,
                                  textAnchor: "start",
                                  offsetX: 0,
                                  // formatter: function(e:any, t:any) {
                                  //     e *= 1e3;
                                  //     return wNumb({
                                  //         thousand: ","
                                  //     }).to(e)
                                  // },
                                  style: {
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    align: "left"
                                  }
                            },
                            legend: {
                                  show: !1
                            },
                            colors: ["#3E97FF", "#F1416C", "#50CD89", "#FFC700", "#7239EA"],
                            xaxis: {
                                  categories: categories_labels,//["USA", "India", "Canada", "Brasil", "France"],
                                  labels: {
                                    //  formatter: function(e:any) {
                                    //      return e + "K"
                                    //  },
                                    style: {
                                        colors: a,
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        align: "left"
                                    }
                                  },
                                  axisBorder: {
                                    show: !1
                                  }
                            },
                            yaxis: {
                                  labels: {
                                    formatter: function(et:any, t:any) {
                                          let result = parseInt((100 * et / 18)+"");
                                        return Number.isInteger(et) ? et + " - " + result.toString() + "%" : et
                                    },
                                    style: {
                                        colors: a,
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    },
                                    offsetY: 2,
                                    align: "left"
                                  }
                            },
                            grid: {
                                  borderColor: l,
                                  xaxis: {
                                    lines: {
                                        show: !0
                                    }
                                  },
                                  yaxis: {
                                    lines: {
                                        show: !1
                                    }
                                  },
                                  strokeDashArray: 4
                            },
                            tooltip: {
                                  style: {
                                    fontSize: "12px"
                                  },
                                  y: {
                                    formatter: function(e:any) {
                                        return e
                                    }
                                  }
                            }
                        };
                      e.self = new ApexCharts(t, r), setTimeout((function() {
                        e.self.render(), e.rendered = !0
                      }), 200)
                }
            };
          return {
            init: function() {
                t(e), KTThemeMode.on("kt.thememode.change", (function() {
                      e.rendered && e.self.destroy(), t(e)
                }))
            }
          }
      }();

      setTimeout(() => {
          KTUtil.onDOMContentLoaded((function() {
            KTChartsWidget27.init()
          }));
      }, 50);

    })
  }

  salesXDayMonth(){

    let data = {
      year: this.year_2,
      month: this.month_2,
      sucursale_deliverie_id: this.sucursale_deliverie_id,
    }
    this.sales_x_day_month = null;
    this.dashboardService.salesXDayMonth(data).subscribe((resp:any) => {
      console.log(resp);
      let series_data:any = [];
      let categories_labels:any = [];

      this.sales_x_day_month = resp.sales_for_day_month;
      this.sales_x_day_month.forEach((day:any) => {
          series_data.push(Number(day.total_sales.toFixed(2)));
          categories_labels.push(day.day_created_format);
      });
      this.sales_total_x_day_month = resp.total_sales_current;
      this.sales_total_before_x_day_month = resp.total_sales_before;
      this.percentage_sales_x_day_month = resp.percentageV;
      let MIN = Math.min(...series_data);//Math.min(15,20,19)
      let MAX = Math.max(...series_data);
      //  *
      var KTChartsWidget3 = function () {
          var e:any = {
                self: null,
                rendered: !1
            },
            t = function (e:any) {
                var t = document.getElementById("kt_charts_widget_3");
                if (t) {
                  var a = parseInt(KTUtil.css(t, "height")),
                      l = KTUtil.getCssVariableValue("--bs-gray-500"),
                      r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                      o = KTUtil.getCssVariableValue("--bs-success"),
                      i = {
                        series: [{
                            name: "Ventas",
                            data: series_data,//[18, 18, 20, 20, 18, 18, 22, 22, 20, 20, 18, 18, 20, 20, 18, 18, 20, 20, 22]
                        }],
                        chart: {
                            fontFamily: "inherit",
                            type: "area",
                            height: a,
                            toolbar: {
                              show: !1
                            }
                        },
                        plotOptions: {},
                        legend: {
                            show: !1
                        },
                        dataLabels: {
                            enabled: !1
                        },
                        fill: {
                            type: "gradient",
                            gradient: {
                              shadeIntensity: 1,
                              opacityFrom: .4,
                              opacityTo: 0,
                              stops: [0, 80, 100]
                            }
                        },
                        stroke: {
                            curve: "smooth",
                            show: !0,
                            width: 3,
                            colors: [o]
                        },
                        xaxis: {
                            categories: categories_labels,//["", "Apr 02", "Apr 03", "Apr 04", "Apr 05", "Apr 06", "Apr 07", "Apr 08", "Apr 09", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18", ""],
                            axisBorder: {
                              show: !1
                            },
                            axisTicks: {
                              show: !1
                            },
                            tickAmount: 6,
                            labels: {
                              rotate: 0,
                              rotateAlways: !0,
                              style: {
                                  colors: l,
                                  fontSize: "12px"
                              }
                            },
                            crosshairs: {
                              position: "front",
                              stroke: {
                                  color: o,
                                  width: 1,
                                  dashArray: 3
                              }
                            },
                            tooltip: {
                              enabled: !0,
                              formatter: void 0,
                              offsetY: 0,
                              style: {
                                  fontSize: "12px"
                              }
                            }
                        },
                        yaxis: {
                            tickAmount: 4,
                            max: MAX,
                            min: MIN,
                            labels: {
                              style: {
                                  colors: l,
                                  fontSize: "12px"
                              },
                              formatter: function (e:any) {
                                  return e + " PEN"
                              }
                            }
                        },
                        states: {
                            normal: {
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            },
                            hover: {
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            },
                            active: {
                              allowMultipleDataPointsSelection: !1,
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            }
                        },
                        tooltip: {
                            style: {
                              fontSize: "12px"
                            },
                            y: {
                              formatter: function (e:any) {
                                  return  e + " PEN"
                              }
                            }
                        },
                        colors: [KTUtil.getCssVariableValue("--bs-success")],
                        grid: {
                            borderColor: r,
                            strokeDashArray: 4,
                            yaxis: {
                              lines: {
                                  show: !0
                              }
                            }
                        },
                        markers: {
                            strokeColor: o,
                            strokeWidth: 3
                        }
                      };
                  e.self = new ApexCharts(t, i), setTimeout((function () {
                      e.self.render(), e.rendered = !0
                  }), 200)
                }
            };
          return {
            init: function () {
                t(e), KTThemeMode.on("kt.thememode.change", (function () {
                  e.rendered && e.self.destroy(), t(e)
                }))
            }
          }
      }();

      setTimeout(() => {
          KTUtil.onDOMContentLoaded((function () {
                KTChartsWidget3.init()
          }));
      }, 50);


    })
  }

  salesXSegmentClient(){
    let data = {
      year: this.year_3,
      month: this.month_3,
      sucursale_deliverie_id: this.sucursale_deliverie_id_2,
    }
    this.sales_x_segment_client = null;
    this.dashboardService.salesXSegmentClient(data).subscribe((resp:any) => {
      console.log(resp);
      var categories_labels:any = [];
      var series_data:any = [];

      this.sales_x_segment_client = resp.sales_segment_clients;
      this.sales_x_segment_client.forEach((segment_client:any) => {
          categories_labels.push(segment_client.client_segment_name);
          series_data.push(segment_client.total_sales);
      });
      this.sales_total_x_segment_client = resp.total_sales_segment_client;
      // *
      var KTChartsWidget18 = function () {
          var e:any = {
                self: null,
                rendered: !1
            },
            t = function (e:any) {
                var t = document.getElementById("kt_charts_widget_18_chart");
                if (t) {
                  var a = parseInt(KTUtil.css(t, "height")),
                      l = KTUtil.getCssVariableValue("--bs-gray-900"),
                      r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                      o = {
                        series: [{
                            name: "Ventas",
                            data: series_data,//[54, 42, 75, 110, 23, 87, 50]
                        }],
                        chart: {
                            fontFamily: "inherit",
                            type: "bar",
                            height: a,
                            toolbar: {
                              show: !1
                            }
                        },
                        plotOptions: {
                            bar: {
                              horizontal: !1,
                              columnWidth: ["28%"],
                              borderRadius: 5,
                              dataLabels: {
                                  position: "top"
                              },
                              startingShape: "flat"
                            }
                        },
                        legend: {
                            show: !1
                        },
                        dataLabels: {
                            enabled: !0,
                            offsetY: -28,
                            style: {
                              fontSize: "13px",
                              colors: [l]
                            },
                            formatter: function (e:any) {
                              return e
                            }
                        },
                        stroke: {
                            show: !0,
                            width: 2,
                            colors: ["transparent"]
                        },
                        xaxis: {
                            categories: categories_labels,//["QA Analysis", "Marketing", "Web Dev", "Maths", "Front-end Dev", "Physics", "Phylosophy"],
                            axisBorder: {
                              show: !1
                            },
                            axisTicks: {
                              show: !1
                            },
                            labels: {
                              style: {
                                  colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                                  fontSize: "13px"
                              }
                            },
                            crosshairs: {
                              fill: {
                                  gradient: {
                                    opacityFrom: 0,
                                    opacityTo: 0
                                  }
                              }
                            }
                        },
                        yaxis: {
                            labels: {
                              style: {
                                  colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                                  fontSize: "13px"
                              },
                              formatter: function (e:any) {
                                  return e + " PEN"
                              }
                            }
                        },
                        fill: {
                            opacity: 1
                        },
                        states: {
                            normal: {
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            },
                            hover: {
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            },
                            active: {
                              allowMultipleDataPointsSelection: !1,
                              filter: {
                                  type: "none",
                                  value: 0
                              }
                            }
                        },
                        tooltip: {
                            style: {
                              fontSize: "12px"
                            },
                            y: {
                              formatter: function (e:any) {
                                  return +e + " PEN"
                              }
                            }
                        },
                        colors: [KTUtil.getCssVariableValue("--bs-primary"), KTUtil.getCssVariableValue("--bs-primary-light")],
                        grid: {
                            borderColor: r,
                            strokeDashArray: 4,
                            yaxis: {
                              lines: {
                                  show: !0
                              }
                            }
                        }
                      };
                  e.self = new ApexCharts(t, o), setTimeout((function () {
                      e.self.render(), e.rendered = !0
                  }), 200)
                }
            };
          return {
            init: function () {
                t(e), KTThemeMode.on("kt.thememode.change", (function () {
                  e.rendered && e.self.destroy(), t(e)
                }))
            }
          }
      }();

      setTimeout(() => {
          KTUtil.onDOMContentLoaded((function () {
            KTChartsWidget18.init()
          }));
      }, 50);

    })
  }

  salesXAsesor(){
    let data = {
      year: this.year_4,
      month: this.month_4
    };
    this.asesor_most_sales = null;
    this.dashboardService.salesXAsesor(data).subscribe((resp:any) => {
      console.log(resp);
      this.asesor_most_sales = resp.asesor_most_sales;
      this.asesor_total_most_sales = this.asesor_most_sales.total_sales;
      this.asesor_percentage_v_most_sales = resp.percentageV;
      let MONTH_CURRENT:any = resp.month_name;
      let categories_labels:any = [];
      let series_data:any = [];
      resp.asesor_sales_week.forEach((sales_for_day:any) => {
          series_data.push(sales_for_day.total_sales);
          categories_labels.push(sales_for_day.day);
      });
      let KTCardsWidget6 = {
          init: function () {
            var e = document.getElementById("kt_card_widget_6_chart");
            if (e) {
                  var t = parseInt(KTUtil.css(e, "height")),
                    a = KTUtil.getCssVariableValue("--bs-gray-500"),
                    l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                    r = KTUtil.getCssVariableValue("--bs-primary"),
                    o = KTUtil.getCssVariableValue("--bs-gray-300"),
                    i = new ApexCharts(e, {
                        series: [{
                          name: "Ventas",
                          data: series_data,//[30, 60, 53, 45, 60, 75, 53]
                        }],
                        chart: {
                          fontFamily: "inherit",
                          type: "bar",
                          height: t,
                          toolbar: {
                              show: !1
                          },
                          sparkline: {
                              enabled: !0
                          }
                        },
                        plotOptions: {
                          bar: {
                              horizontal: !1,
                              columnWidth: ["55%"],
                              borderRadius: 6
                          }
                        },
                        legend: {
                          show: !1
                        },
                        dataLabels: {
                          enabled: !1
                        },
                        stroke: {
                          show: !0,
                          width: 9,
                          colors: ["transparent"]
                        },
                        xaxis: {
                        categories: categories_labels,
                          axisBorder: {
                              show: !1
                          },
                          axisTicks: {
                              show: !1,
                              tickPlacement: "between"
                          },
                          labels: {
                              show: !1,
                              style: {
                                colors: a,
                                fontSize: "12px"
                              }
                          },
                          crosshairs: {
                              show: !1
                          }
                        },
                        yaxis: {
                          labels: {
                              show: !1,
                              style: {
                                colors: a,
                                fontSize: "12px"
                              }
                          }
                        },
                        fill: {
                          type: "solid"
                        },
                        states: {
                          normal: {
                              filter: {
                                type: "none",
                                value: 0
                              }
                          },
                          hover: {
                              filter: {
                                type: "none",
                                value: 0
                              }
                          },
                          active: {
                              allowMultipleDataPointsSelection: !1,
                              filter: {
                                type: "none",
                                value: 0
                              }
                          }
                        },
                        tooltip: {
                          style: {
                              fontSize: "12px"
                          },
                          x: {
                              formatter: function (e:any) {
                                return MONTH_CURRENT+": " + e
                              }
                          },
                          y: {
                              formatter: function (e:any) {
                                return e + " PEN"
                              }
                          }
                        },
                        colors: [r, o],
                        grid: {
                          padding: {
                              left: 10,
                              right: 10
                          },
                          borderColor: l,
                          strokeDashArray: 4,
                          yaxis: {
                              lines: {
                                show: !0
                              }
                          }
                        }
                    });
                  setTimeout((function () {
                    i.render()
                  }), 300)
            }
          }
        };

        setTimeout(() => {
          KTUtil.onDOMContentLoaded((function () {
            KTCardsWidget6.init()
          }))
        }, 50);

    })
  }

  salesXCategorias(){

    let data = {
      year: this.year_5,
      month: this.month_5,
    }
    this.categories_most_sales = null;
    this.dashboardService.salesXCategorias(data).subscribe((resp:any) => {
      console.log(resp);
      this.categories_most_sales = resp.categories_most_sales;
      let categories_labels:any = [];
      let series_data:any = [];
      this.list_categories = resp.categorie_products;
      if(this.list_categories.length > 0){
          this.optionSelected(this.list_categories[0].id,this.list_categories[0].products);
      }
      // products_x_categories
      this.categories_most_sales.forEach((categorie:any) => {
          categories_labels.push(categorie.categorie_name);
          series_data.push(categorie.total_sales);
      });
          // *
          var KTChartsWidget22 = function () {
            var e = function (e:any, t:any, a:any, l:any) {
                var r = document.querySelector(t);
                if (r) {
                  parseInt(KTUtil.css(r, "height"));
                  var o = {
                        series: a,
                        chart: {
                            fontFamily: "inherit",
                            type: "donut",
                            width: 250
                        },
                        plotOptions: {
                            pie: {
                              donut: {
                                  size: "50%",
                                  labels: {
                                    value: {
                                        fontSize: "10px"
                                    }
                                  }
                              }
                            }
                        },
                        colors: [
                            KTUtil.getCssVariableValue("--bs-info"),
                            KTUtil.getCssVariableValue("--bs-success"),
                            KTUtil.getCssVariableValue("--bs-primary"),
                            KTUtil.getCssVariableValue("--bs-danger"),
                        '#7fffd4','#87ceeb','#4169e1','#3cb371','#808000','#008080','#fff8dc',
                        '#bc8f8f','#a0522d','#cd853f','#b8860b','#2f4f4f','#d2b48c'
                        ],
                        stroke: {
                            width: 0
                        },
                        labels: categories_labels,//["Sales", "Sales", "Sales", "Sales"],
                        legend: {
                            show: !1
                        },
                        fill: {
                            type: "false"
                        }
                      },
                      i = new ApexCharts(r, o),
                      s:any = !1,
                      n = document.querySelector(e);
                  !0 === l && (i.render(), s = !0), n.addEventListener("shown.bs.tab", (function (e:any) {
                      0 == s && (i.render(), s = !0)
                  }))
                }
            };
            return {
                init: function () {
                  e("#kt_chart_widgets_22_tab_1", "#kt_chart_widgets_22_chart_1", series_data, !0)//,
                  // e("#kt_chart_widgets_22_tab_2", "#kt_chart_widgets_22_chart_2", [70, 13, 11, 2], !1)
                }
            }
          }();

          setTimeout(() => {
            KTUtil.onDOMContentLoaded((function () {
                KTChartsWidget22.init()
            }));
          }, 50);
    })
  }

  optionSelected(categorie_id:any,products:any = []){
    this.option_selected = categorie_id;
    this.products_x_categories = [];
    setTimeout(() => {
      this.products_x_categories = products;
      this.isLoadingProcess();
    }, 50);
  }

  getColorTag(i:number){
    let colors = [
      KTUtil.getCssVariableValue("--bs-info"),
      KTUtil.getCssVariableValue("--bs-success"),
      KTUtil.getCssVariableValue("--bs-primary"),
      KTUtil.getCssVariableValue("--bs-danger"),
      '#7fffd4','#87ceeb','#4169e1','#3cb371','#808000','#008080','#fff8dc',
      '#bc8f8f','#a0522d','#cd853f','#b8860b','#2f4f4f','#d2b48c'
    ];
    return colors[i];
  }
}
