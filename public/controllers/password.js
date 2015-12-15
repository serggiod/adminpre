angular
	.module('adminpre')
	.controller('password',function($scope,$location,$http){

		$scope.alert      = {
			type:'warning',
			text:'Complete el formulario para cambiar el password.'
		};

		$scope.password   = '';
		$scope.repassword = '';

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar = function(){
			
			json = {
				pass   : CryptoJS.MD5($scope.password).toString(),
				repass : CryptoJS.MD5($scope.repassword).toString()
			};
			
			if($scope.password){
				if(json.pass===json.repass){

					$http.put('models/login.php/password',json)
						.success(function(json){
							if(json.result){
								$scope.alert.type = 'success';
								$scope.alert.text = 'El password se ha modificado en forma correcta.';
								$('#password').attr('disabled','true');
								$('#repassword').attr('disabled','true');
								$('#cancelar').attr('style','display:none;');
								$('#aceptar').attr('style','display:none;');

							} else {
								$scope.alert.type = 'danger';
								$scope.alert.text = 'No se pudo modficar el password.';
							}
						})
						.error(function(){
							$location.path('/');
						});

				} else {

					$scope.alert.type = 'danger';
					$scope.alert.text = 'Los campos \"Nuevo Password\"" y \"Repetir Password\"" deben ser identicos.';
					$scope.password   = '';
					$scope.repassword = '';
					json.pass         = '';
					json.repass       = '';
				}
			}


		}

	});