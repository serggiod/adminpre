angular
	.module('adminpre')
	.controller('acercade',function($scope,$location,$http){

		$scope.aceptar = function(){
			$location.path('/partes');
		}

	});