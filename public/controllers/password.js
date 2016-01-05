angular
	.module('adminpre')
	.controller('password',function($scope,$location,$http,$session){

		$scope.init = function(){
			$session.autorize(function(){
				$scope.alert  = {
					type:'green',
					text:'Complete el formulario para cambiar el password.'
				};
				$scope.password   = '';
				$scope.repassword = '';				
			});
		}

		$scope.cancelar = function(){
			$location.path('/partes');
		};

		$scope.aceptar = function(){
			
			if($scope.password.length>=4 && $scope.repassword.length>=4) {
				var json = {
					pass   : CryptoJS.MD5($scope.password).toString(),
					repass : CryptoJS.MD5($scope.repassword).toString()
				};
				if(json.pass===json.repass) {
					$session.autorize(function(){
						$http.put('models/login.php/password',json)
							.success(function(json){
								if(json.result){
									$scope.alert.type = 'green';
									$scope.alert.text = 'El password se ha modificado en forma correcta.';
									$('#password').attr('disabled','true');
									$('#repassword').attr('disabled','true');
									$('#cancelar').hide();
									$('#aceptar').hide();


								} 

								else {
									$scope.alert.type = 'red';
									$scope.alert.text = 'No se pudo modficar el password.';
								}
							})
							.error(function(){
								$session.destroy();
							});
					});
				}

				else {
					$scope.alert.type = 'red';
					$scope.alert.text = 'Los campos \"Password\"" y \"Re-Password\"" deben ser iguales.';
					$scope.password   = '';
					$scope.repassword = '';
					json.pass         = '';
					json.repass       = '';
				}
			}

			else {
				$scope.alert.type = 'red';
				$scope.alert.text = 'Todos los campos son obligatorios.';
			}
		}

		$session.mainmenu();
		$scope.init();

	});