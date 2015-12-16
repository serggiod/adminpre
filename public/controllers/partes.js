angular
	.module('adminpre')
	.controller('partes',function($scope,$location,$http){

		$scope.menu = true;
		$scope.partes = {};

		$scope.reloadPartes = function(){
			$http.get('models/partes.php/partes')
				.success(function(json){
					$scope.partes = json;
				})
				.error(function(){
					$location.path('/login');
				});
		};

		$scope.nuevo = function(){
			$location.path('/partes/nuevo');
		};

		$scope.visualizar = function(id){
			$location.path('/partes/visualizar/'+id);
		};

		$scope.modificar = function(id){
			if(id){
				if(confirm('¿Esta seguro que desea modificar este registro?')){
					$location.path('/partes/modificar/'+id);
				}
			}
		}

		$scope.estado   = function(id){
			if(id){
				if(confirm('¿Esta seguro que desea cambiar el estado de este registro?')){
					$http.put('models/partes.php/parte/'+id+'/estado')
						.success(function(json){
							if(json.result){
								$scope.reloadPartes();
							}
						})
						.error(function(){
							$location.path('/');
						});
				}
			}
		};

		$scope.eliminar = function(id){
			if(id){
				if(confirm('¿Esta seguro que desea eliminar este registro?')){
					$http.delete('models/partes.php/parte/'+id)
						.success(function(json){
							if(json.result){
								$scope.reloadPartes();
							}
						})
						.error(function(){
							$location.path('/');
						});
				}
			}
		};

		$scope.reloadPartes();

		$('#loading').hide();

	});