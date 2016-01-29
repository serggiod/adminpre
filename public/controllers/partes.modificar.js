angular
	.module('adminpre')
	.controller('partesModificar',function($scope,$location,$http,$routeParams,$session){

		$scope.editorCabeza = {
			theme			 : 'gray',
			iframe           : false,
			height			 : 260,
			heightMin        : 260,
			heightMax        : 260,
			disableRightClick: true,
			editInPopup      : false,
			placeholderText  : ' ',
	        toolbarButtons   : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        toolbarButtonsMD : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        toolbarButtonsSM : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        htmlRemoveTags   : ['script', 'style', 'base'],
	        pasteAllowLocalImages: false
	    };

	    $scope.editorCuerpo = {
			theme			 : 'gray',
			iframe           : false,
			height			 : 260,
			heightMin        : 260,
			heightMax        : 260,
			disableRightClick: true,
			editInPopup      : false,
			placeholderText  : ' ',
	        toolbarButtons   : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        toolbarButtonsMD : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        toolbarButtonsSM : ['bold','italic','underline','|','align','|','paragraphFormat'],
	        htmlRemoveTags   : ['script', 'style', 'base'],
	        pasteAllowLocalImages: false
	    };

		$scope.init = function(){
			$scope.id = $routeParams.id;
			$scope.alert = {};
			$http.get('models/partes.php/parte/'+$scope.id)
				.success(function(json){
					$scope.volanta = json.volanta;
					$scope.titulo  = json.titulo;
					$scope.bajada  = json.bajada;
					$scope.editorCabeza.froalaEditor('html.set',json.cabeza);
					$scope.editorCuerpo.froalaEditor('html.set',json.cuerpo);
					$scope.cuerpo  = json.cuerpo;
					$scope.dia     = parseInt(json.dia);
					$scope.mes     = parseInt(json.mes);
					$scope.anio    = parseInt(json.anio);
					$scope.hora    = parseInt(json.hora);
					$scope.minuto  = parseInt(json.minuto);
					$scope.segundo = parseInt(json.segundo);
					$http.get('models/partes.php/parte/fotografias/'+$scope.id)
						.success(function(json){
							$scope.fotografias = json;
							$scope.alert.type = 'yellow';
							$scope.alert.text = 'Cambie los datos para modificar el parte de prensa.';
						})
						.error(function(){
							$session.destroy();
						});
				})
				.error(function(){
					$session.destroy();
				});
		};

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar  = function(){
			$session.autorize(function(){
				json = {
					volanta:$scope.volanta,
					titulo:$scope.titulo,
					bajada:$scope.bajada,
					cabeza:$scope.editorCabeza.froalaEditor('html.get'),
					cuerpo:$scope.editorCuerpo.froalaEditor('html.get'),
					fecha:$scope.anio+'-'+$scope.mes+'-'+$scope.dia,
					hora:$scope.hora+':'+$scope.minuto+':'+$scope.segundo
				};
				$http.put('models/partes.php/parte/'+$scope.id,json)
					.success(function(json){
						$('#loading').hide();
						if(json.result){
							$location.path('/partes');
						} 
						else {
							$scope.alert.type = 'red';
							$scope.alert.text = 'Se detecto un error.';
						}
					})
					.error(function(){
						$session.destroy();
					});
			});
		};

		$scope.subir = function(){
			if(($scope.titulo.length>=1) && ($scope.cabeza.length>=1)){
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
							    error:function(){
							    	$session.destroy();
							    }
							});

						}
					}
				});
				fileInput.click();
			} 
			else {
				$scope.alert.type = 'red';
				$scope.alert.text = 'Todos los campos son obligatorios.';
			}
		};

		$scope.removeFotografia = function(f,pf,a){
			$http.delete('models/partes.php/parte/fotografia/'+f+'/'+pf+'/'+a)
				.success(function(json){
			        if(json.result){
			        	$('#'+f+pf).remove();
			    	}
			    })
				.error(function(){
					$session.destroy();
				});
		};

		$session.autorize(function(){
			$scope.init();
		});

	});