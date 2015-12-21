angular
	.module('adminpre')
	.controller('partesVisualizar',function($scope,$location,$http,$routeParams){

		$scope.id = $routeParams.id;

		$scope.reload = function(){

			$scope.volanta = '';
			$scope.titulo  = '';
			$scope.bajada  = '';

			$scope.cabeza  = '';
			$scope.cuerpo  = '';

			$scope.fecha   = '';
			$scope.hora    = '';

			$scope.fotografias = {};

			$http.get('models/partes.php/parte/'+$scope.id)
				.success(function(json){
					$scope.volanta = json.volanta;
					$scope.titulo  = json.titulo;
					$scope.bajada  = json.bajada;

					$scope.cabeza  = json.cabeza;
					$scope.cuerpo  = json.cuerpo;

					$scope.fecha   = json.fecha;
					$scope.hora    = json.hora;

					$http.get('models/partes.php/parte/fotografias/'+$scope.id)
						.success(function(json){
							console.log(json);
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

		$scope.aceptar = function(){
			$location.path('/partes');
		};

		$scope.reload();

	});