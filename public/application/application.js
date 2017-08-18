angular
	.module('legapp',['ui.materialize','ngRoute','ngSanitize','textAngular'])
	.config(function($routeProvider){
	    $routeProvider
		    .when('/',{redirectTo:'/partes'})
		    .when('/partes',{
		        templateUrl:'views/partes.html',
		        controller:'partes'
		    })
		    .when('/partes/nuevo',{
		        templateUrl:'views/partes.nuevo.html',
		        controller:'partesNuevo'
		    })
		    .when('/partes/visualizar/:id',{
		        templateUrl:'views/partes.visualizar.html',
		        controller:'partesVisualizar'
		    })
		    .when('/partes/modificar/:id',{
		        templateUrl:'views/partes.modificar.html',
		        controller:'partesModificar'
		    })
		    .otherwise({redirectTo:'/'});
	});