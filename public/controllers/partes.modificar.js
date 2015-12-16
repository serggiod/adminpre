angular
	.module('adminpre')
	.controller('partesModificar',function($scope,$location,$http,$routeParams){

$scope.id = $routeParams.id;

		$scope.reload = function(){

			$scope.volanta = '';
			$scope.titulo  = '';
			$scope.bajada  = '';

			$scope.cabeza  = '';
			$scope.cuerpo  = '';

			$scope.dia     = '';
			$scope.mes     = '';
			$scope.anio    = '';

			$scope.hora    = '';
			$scope.minuto  = '';
			$scope.segundo = '';

			$http.get('models/partes.php/parte/'+$scope.id)
				.success(function(json){
					$scope.volanta = json.volanta;
					$scope.titulo  = json.titulo;
					$scope.bajada  = json.bajada;

					$scope.cabeza  = json.cabeza;
					$scope.cuerpo  = json.cuerpo;

					fecha = json.fecha.split('-');
					$scope.dia     = parseInt(fecha[0]);
					$scope.mes     = parseInt(fecha[1]);
					$scope.anio    = parseInt(fecha[2]);

					hora = json.hora.split(':');
					$scope.hora    = parseInt(hora[0]);
					$scope.minuto  = parseInt(hora[1]);
					$scope.segundo = parseInt(hora[2]);
				})
				.error(function(){
					$location.path('/login');
				});
		};

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar  = function(){
			$('#loading').show();
			json = {
				volanta:$scope.volanta,
				titulo:$scope.titulo,
				bajada:$scope.bajada,
				cabeza:$scope.cabeza,
				cuerpo:$scope.cuerpo,
				fecha:$scope.anio+'-'+$scope.mes+'-'+$scope.dia,
				hora:$scope.hora+':'+$scope.minuto+':'+$scope.segundo
			};
			$http.put('models/partes.php/parte/'+$scope.id,json)
				.success(function(json){
					$('#loading').hide();
					if(json.result){
						dialog = BootstrapDialog.show({
							type:BootstrapDialog.TYPE_SUCCESS,
							closable:false,
							title:'Correcto',
							message:'El parte de prensa se ha modiicado en forma correcta.',
							buttons:[{
								label:'Aceptar',
								cssClass:'btn btn-success',
								action:function(){
									$scope.reload();
									$scope.gotoPartes();
									dialog.close();
								}
							}]
						});
					} else {
						dialog = BootstrapDialog.show({
							type:BootstrapDialog.TYPE_DANGER,
							closable:false,
							title:'Error',
							message:'El parte de prensa no se ha modificado en forma correcta.',
							buttons:[{
								label:'Aceptar',
								cssClass:'btn btn-danger',
								action:function(){
									dialog.close();
								}
							}]
						});
					}
				})
				.error(function(){
					$('#loading').hide();
					$location.path('/login');
				});
		};

		$scope.gotoPartes = function(){
			window.location.href = '#/partes';
		};

		$scope.reload();
	});