angular
	.module('adminpre')
	.controller('partes',function($scope,$location,$http,$session){

		$scope.init = function(){
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
			if(id>=1){
				if(confirm('¿Esta seguro que desea modificar este registro?')){
					$location.path('/partes/modificar/'+id);
				}
			}
		}

		$scope.estado   = function(id){
			if(id>=1){
				if(confirm('¿Esta seguro que desea cambiar el estado de este registro?')){
					$session.autorize(function(){
						$http.put('models/partes.php/parte/'+id+'/estado')
							.success(function(json){
								if(json.result){
									$scope.init();
								}
							})
							.error(function(){
								$session.destroy();
							});s
					});
				}
			}
		};

		$scope.eliminar = function(id){
			if(id>=1){
				if(confirm('¿Esta seguro que desea eliminar este registro?')){
					$session.autorize(function(){
						$http.delete('models/partes.php/parte/'+id)
							.success(function(json){
								if(json.result){
									$scope.init();
								}
							})
							.error(function(){
								$session.destroy();
							});
					});
				}
			}
		};

		$session.autorize(function(){
			$session.mainmenu();
			$scope.init();
		});

	});