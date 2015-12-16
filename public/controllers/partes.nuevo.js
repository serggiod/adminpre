angular
	.module('adminpre')
	.controller('partesNuevo',function($scope,$location,$http){

		$scope.date = new Date();

		$scope.reload = function(){
			$scope.volanta = '';
			$scope.titulo  = '';
			$scope.bajada  = '';

			$scope.cabeza  = '';
			$scope.cuerpo  = '';

			$scope.dia     = $scope.date.getDate();
			$scope.mes     = $scope.date.getMonth() +1;
			$scope.anio    = $scope.date.getFullYear();

			$scope.hora    = $scope.date.getHours();
			$scope.minuto  = $scope.date.getMinutes();
			$scope.segundo = $scope.date.getSeconds();
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
			$http.post('models/partes.php/parte',json)
				.success(function(json){
					$('#loading').hide();
					if(json.result){
						dialog = BootstrapDialog.show({
							type:BootstrapDialog.TYPE_SUCCESS,
							closable:false,
							title:'Correcto',
							message:'El parte de prensa se ha ingresado en forma correcta.',
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
							message:'El parte de prensa no se ha ingresado en forma correcta.',
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

		$scope.subir = function(){
			if(($scope.titulo.length > 1) && ($scope.cabeza.length > 1)){
				archivos = $('#archivos');
				archivos.click();
				archivos.on('change',function(){
					archivos = this.files;
					for(i=0;i<archivos.length;i++){
						type = archivos[i].type.split('/');
						if(type=='image'){

							form = new FormData;

							form.append('titulo',$scope.titulo);
							form.append('texto',$scope.cabeza);
							form.append('fecha',$scope.anio+'-'+$scope.mes+'-'+$scope.dia);
							form.append('archivo',archivos[i]);

							console.log(archivos[i]);

							$.ajax({
							    url	:'models/partes.php/parte/fotografia',	
							    type:'POST',
							    processData:false,
	                            contentType:false,
							    data:form,
							    success:function(json){
							        if(json.result){
							             $scope.reloadFotografias();
							        }
							    },
							    error:function(){ $location.path('/login'); }
							});

						}
					}
				})
			} else {
				dialog = BootstrapDialog.show({
					type:BootstrapDialog.TYPE_DANGER,
					closable:false,
					title:'Error',
					message:'Primero debe completar los campos <b>Titulo</b> y <b>Cabeza</b>.',
					buttons:[{
						label:'Aceptar',
						cssClass:'btn btn-danger',
						action:function(){ dialog.close(); }
					}]
				});
			}
		};

		$scope.reloadFotografias = function(){
			alert('Recargar fotografias');
		};

		$scope.gotoPartes = function(){
			window.location.href = '#/partes';
		};

		$scope.reload();

	});