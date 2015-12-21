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
			$scope.fotografias = {};

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

					$http.get('models/partes.php/parte/fotografias/'+$scope.id)
						.success(function(json){
							$scope.fotografias = json;
						})
						.error(function(){
							$location.path('/login');
						});
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

		$scope.subir = function(){
			if(($scope.titulo.length > 1) && ($scope.cabeza.length > 1)){
				var fileInput = $('#fileInput');
				fileInput.on('change',function(){
					fileList = this.files;
					for(i=0;i<fileList.length;i++){
						type = fileList[i].type.split('/');
						if(type[0]==='image'){

							form = new FormData;

							form.append('parteid',$scope.id);
							form.append('titulo',$scope.titulo);
							form.append('texto',$scope.cabeza);
							form.append('fecha',$scope.anio+'-'+$scope.mes+'-'+$scope.dia);
							form.append('archivo',fileList[i]);

							$.ajax({
							    url	:'models/partes.php/parte/fotografia',	
							    type:'POST',
							    processData:false,
	                            contentType:false,
							    data:form,
							    success:function(j){
							    	json = JSON.parse(j);
							        if(json.result){
							        	img  = '<a ';
							        	img += 'id="'+json.fotoId+json.partesFotoId+'" ';
							        	img += 'class="glyphicon glyphicon-remove-sign" style="cursor:pointer;" href="javascript: window.removeFotografia('+json.fotoId+','+json.partesFotoId+',\''+json.archivo+'\')">';
							        	img += '<img ';
							        	img += 'src="/public/img/fotografias/'+json.archivo+'" ';
							        	img += 'width="120" style="margin:5px;float:left;"/>';
							        	img += '</a>';
							            $('#fotografiasDisplay').append(img);
							        }
							    },
							    error:function(){ $location.path('/login'); }
							});

						}
					}
				});
				fileInput.click();
			} else {
				dialog = BootstrapDialog.show({
					type:BootstrapDialog.TYPE_DANGER,
					closable:false,
					title:'Error',
					message:'Primero debe completar el formulario.',
					buttons:[{
						label:'Aceptar',
						cssClass:'btn btn-danger',
						action:function(){ dialog.close(); }
					}]
				});
			}
		};

		$scope.removeFotografia = function(f,pf,a){

			$.ajax({
			    url	:'models/partes.php/parte/fotografia/'+f+'/'+pf+'/'+a,	
			    type:'DELETE',
			    processData:false,
		        contentType:false,
			    success:function(j){
			    	json = JSON.parse(j);
			        if(json.result){
			        	$('#'+f+pf).remove();
			        }
			    },
			    error:function(){ $location.path('#/login'); }
			});

		};

	});