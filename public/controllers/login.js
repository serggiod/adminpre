angular
	.module('adminpre')
	.controller('login',function($scope,$location,$http){

		//$('#pax1').parallax();
		//$('#pax2').parallax();

		$scope.alert    = {
			type:'warning',
			text:'Complete el siguiente formulario con sus datos pesonales.'
		};

		// Reaizar login.
		$scope.login     = function(){
			
			json ={
				user:$scope.usuario,
				pass:CryptoJS.MD5($scope.password).toString()
			}

			$http.post('models/login.php/',json)
			.success(function(json){
				$scope.alert.type= 'success';
				$scope.alert.text='Ha ingresado en forma correcta.';

				$('#navbar-user').html('Bienvenido '+json.nombre+' '+json.apellido);
				$('#navbar').show();

				$location.path('/partes');
			})
			.error(function(){
				$scope.alert.type='danger';
				$scope.alert.text='El servidor informa que este usuario no existe.';
			});

		}

		// Ocultar loading.
		$('#loading').hide();

	});