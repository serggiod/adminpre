angular
	.module('adminpre')
	.controller('logout',function($scope,$location,$http,$session){

		$session.mainmenu();

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar  = function(){
			$session.autorize(function(){
				$http.delete('models/login.php/logout')
					.success(function(json){
						if(json.result){
							$session.destroy();	
						}					
					})
					.error(function(){
						$location.path('/partes');
					});
			});
		};
	});