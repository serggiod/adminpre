angular 
	.module('legapp')
	.controller('partesVisualizar',function($scope,$location,$http,$routeParams,$session){

		$scope.init = function(){
			$session.init();
			$scope.id = $routeParams.id;
			$scope.alert = {};

			$scope.toolbar = [
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
				['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
				['justifyLeft','justifyCenter','justifyRight','justifyFull']
			];

			$scope.disabled=true;
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

		$scope.init();

	});