angular
	.module('adminpre')
	.controller('partes',function($scope,$location,$http){

		$scope.menu = true;
		$scope.partes = {};

		$scope.reloadPartes = function(){
			$http.get('models/partes.php/partes')
				.success(function(json){
					$scope.partes = json;
				})
				.error(function(){
					$location.path('/login');
				});
		};

		$scope.nuevo = function(){
			dialog = BootstrapDialog.show({
				type:BootstrapDialog.TYPE_PRIMARY,
				closable:false,
				title:'Nuevo Parte de Prensa',
				message:$scope.formulario(),
				buttons:[{
					label:'Cancelar',
					cssClass:'btn btn-danger',
					action:function(){ dialog.close(); }
				},{
					label:'Aceptar',
					cssClass:'btn btn-success',
					action:function(){
						alert('Procesar y enviar el formulario');
					}
				}]
			});
		};

		$scope.estado   = function(id){
			if(confirm('¿Esta seguro que desea cambiar el estado de este registro?')){
				$http.put('models/partes.php/parte/'+id+'/estado')
					.success(function(json){
						if(json.result){
							$scope.reloadPartes();
						}
					})
					.error(function(){
						$location.path('/');
					});
			}
		};

		$scope.eliminar = function(id){
			if(confirm('¿Esta seguro que desea eliminar este registro?')){
				$http.delete('models/partes.php/parte/'+id)
					.success(function(json){
						if(json.result){
							$scope.reloadPartes();
						}
					})
					.error(function(){
						$location.path('/');
					});
			}

		};

		$scope.formulario = function(){
			html = 'Formulario';
			return html;
		} 

		$scope.reloadPartes();
		// Ocultar loading.
		$('#loading').hide();

	});