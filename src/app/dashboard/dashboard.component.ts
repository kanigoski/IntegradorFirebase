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
    templateUrl: 'dashboard.component.html',
})

export class DashboardComponent implements OnInit{
    valor_kwh = 0.645310;
	consumo_mensal = 0;
	consumoAparelho = 0;
    media_hora = 4;
    media_dia = 5;

    aparelhos: any[];
    tomadasCol: AngularFirestoreCollection<Tomadas>;
	tomadas: any;
	objTeste = null;

	media_por_tomada: Array<{id: string, descricao: string, consumo: number}> = [];

    constructor(private db: AngularFirestore) {
    }

    ngOnInit(){
		this.tomadasCol = this.db.collection('tomadas');

        this.tomadas = this.tomadasCol.snapshotChanges()
          	.map(actions => {
				this.consumo_mensal = 0;
				this.media_por_tomada = [];

            	return actions.map(a => {
              		const data = a.payload.doc.data() as Tomadas;
              		const id = a.payload.doc.id;
					this.consumoAparelho = 0;

 	            	data.gastos.map(gasto => {
						const corrente = gasto.corrente;
						const tensao = gasto.tensao;

						this.consumo_mensal = this.consumo_mensal + ((tensao * (corrente * 1) / 1000));
						this.consumoAparelho = this.consumoAparelho + ((tensao * (corrente * 1) / 1000));
						
					})

					this.media_por_tomada.push({id: id, descricao: data.descricao, consumo: this.consumoAparelho});

					console.log(this.media_por_tomada);
              	return {id, data};
			})
		})

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
