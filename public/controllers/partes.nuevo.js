angular
	.module('adminpre')
	.controller('partesNuevo',function($scope,$location,$http,$session){

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
			$scope.date = new Date();
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
			$scope.alert = {
				type:'yellow',
				text:'Complete el siguiente formulario para ingresar un nuevo parte de prensa.'
			};
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
				$http.post('models/partes.php/parte',json)
					.success(function(json){
						if(json.result){
							$scope.alert.type = 'green';
							$scope.alert.text = 'El parte de prensa se ha ingresado en forma correcta.';
							$location.path('/partes');
						} else {
							$scope.alert.type = 'red';
							$scope.alert.text = 'El parte de prensa no se ha ingresado en forma correcta.';
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

								var form = new FormData;

								form.append('titulo',$('#titulo').val());
								form.append('texto',$('#cabeza').val());
								form.append('fecha',$('#anio').val()+'-'+$('#mes').val()+'-'+$('#dia').val());
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
			} 

			else {
				$scope.alert.type = 'red';
				$scope.alert.text = 'Primero debe completar el formulario.';
			}
		};

		$session.autorize(function(){
			$session.mainmenu();
			$scope.init();
		});

	});

window.removeFotografia = function(f,pf,a){
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
	    error:function(){ window.location.href = '#/login'; }
	});
};