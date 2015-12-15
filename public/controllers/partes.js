angular
	.module('adminpre')
	.controller('partes',function($scope,$location,$http){

		$scope.menu = true;

		// Ocultar loading.
		$('#loading').hide();

	});