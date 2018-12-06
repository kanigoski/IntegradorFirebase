import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, Timestamp } from 'rxjs';
import 'rxjs/add/operator/map';

declare var $:any;

interface Tomadas {
  descricao: string;
  gastos: any[];
  ligado: boolean;
  local: string;
}

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{
    aparelhos: any[];
    tomadasCol: AngularFirestoreCollection<Tomadas>;
    tomadas: any;

    constructor(private db: AngularFirestore) {
    }

    valor_kwh = 0.645310;
    consumo_mensal = 0;
    media_hora = 4;
    media_dia = 5;

    ngOnInit(){
        this.tomadasCol = this.db.collection('tomadas');
        this.tomadas = this.tomadasCol.snapshotChanges()
          .map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as Tomadas;
              const id = a.payload.doc.id;

              console.log(data.gastos
                .map(gasto => {
                  const corrente = gasto.corrente;
                  const tensao = gasto.tensao;

                  this.consumo_mensal = this.consumo_mensal + ((tensao * (corrente*10) * 30 / 1000));

                  console.log(this.consumo_mensal);
                })
              );

              return {id, data};
            })
          })

        var dataSales = {
          labels: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
          series: [
             [287, 385, 490, 562, 594, 626],
            [67, 152, 193, 240, 387, 435],
            [23, 113, 67, 108, 190, 239]
          ]
        };

        var optionsSales = {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);


        var data = {
          labels: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
          series: [
            [1, 2, 2, 2.5, 2.1, 1.6, 3, 3.4, 4.2, 5, 4.7, 4.3]
          ]
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartActivity', data, options, responsiveOptions);

        var dataPreferences = {
            series: [
                [25, 30, 20, 25]
            ]
        };

        var optionsPreferences = {
            donut: true,
            donutWidth: 40,
            startAngle: 0,
            total: 100,
            showLabel: false,
            axisX: {
                showGrid: false
            }
        };

        new Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

        new Chartist.Pie('#chartPreferences', {
          labels: ['40%','5%','35%','20%'],
          series: [40, 5, 35 , 20]
        });
    }
}
