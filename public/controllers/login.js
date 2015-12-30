angular
	.module('adminpre')
	.controller('login',function($scope,$location,$http){

		$scope.usuario  = '';
		$scope.password = '';

		$scope.alert    = {
			type:'green lighten-3',
			text:'Complete el siguiente formulario con sus datos pesonales.'
		};

		// Reaizar login.
		$scope.login     = function(){
			
			if(($scope.usuario.length>=1) && ($scope.password.length>=1)){
				json ={
					user:$scope.usuario,
					pass:CryptoJS.MD5($scope.password).toString()
				}

				$http.post('models/login.php/',json)
				.success(function(json){
					$scope.alert.type = 'green lighten-3';
					$scope.alert.text = 'El usuario ha creado una sesion en forma correcta.';

					if(json.result){
						$('#navbar-user').html('Bienvenido '+json.nombre+' '+json.apellido);
						$location.path('/partes');
					} else {
						$scope.alert.type='red lighten-4';
						$scope.alert.text='El servidor informa que este usuario no existe.';						
					}
				})
				.error(function(){
					$scope.alert.type='red lighten-4';
					$scope.alert.text='El servidor informa que este usuario no existe.';
				});
			} else {
				$scope.alert.type = "red lighten-4";
				$scope.alert.text = "Todos los campos son obligatorios.";
			}

		}

		// Ocultar loading.
		$('#loading').hide();

	});