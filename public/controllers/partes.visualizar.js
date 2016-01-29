angular
	.module('adminpre')
	.controller('partesVisualizar',function($scope,$location,$http,$routeParams,$session){

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
					$scope.cabeza  = json.cabeza;
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
							$scope.alert.type = 'blue';
							$scope.alert.text = 'Visualizando un parte de prensa.';
							$scope.editorCabeza.froalaEditor('toolbar.disable');
							$scope.editorCuerpo.froalaEditor('toolbar.disable');
							$scope.editorCabeza.froalaEditor('edit.off');
							$scope.editorCuerpo.froalaEditor('edit.off');
						})
						.error(function(){
							$session.destroy();
						});
				})
				.error(function(){
					$session.destroy();
				});
		};

		$scope.aceptar = function(){
			$location.path('/partes');
		};

		$session.autorize(function(){
			$session.mainmenu();
			$scope.init();	
		});

	});