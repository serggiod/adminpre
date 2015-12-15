angular
	.module('adminpre')
	.controller('logout',function($scope,$location,$http){

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar  = function(){
			$http.delete('models/login.php/logout')
				.success(function(json){
					if(json.result){
						$('#navbar').hide();
						$location.path('/');	
					}					
				})
				.error(function(){
					$location.path('/partes');
				});
		};

	});