angular
	.module('adminpre')
	.controller('partes',function($scope,$location,$http,$session){

		$scope.xpos = 0;
		$scope.titulo = '';
		$scope.categorias = $session.getUser().categorias;

		// Establecer categoria por defecto.
		console.log(parseInt($session.get('categoriaId')));
		if($session.get('categoriaId')){
			$scope.categoriaId = $session.get('categoriaId');
		}
		else {
			$scope.categoriaId = $scope.categorias[0].categoria;
			$session.set('categoriaId',$scope.categoriaId);
		}

		$scope.categoriaSelected = function(){
			$session.set('categoriaId',$scope.categoriaId);
			$scope.init();
		};

		$scope.datepicker = $('.datepicker').pickadate({
			monthsFull:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthsShort:['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
			weekdaysFull:['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
			weekdaysShort:['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
			weekdaysLetter:['D', 'L', 'M', 'M', 'J', 'V', 'S'],
			showMonthsShort: true,
			today:'Hoy',
			clear:'Borrar',
			close:'Cerrar',
			firstDay: 1,
			format: 'dd/mm/yyyy',
			dateFormat: 'yyyy-mm-dd',
			formatSubmit: 'yyyy-mm-dd',
			selectMonths:true, 
			selectYears:15,
			closeOnSelect:true,
			onSet: function () {
		        this.close();
		    }
		});

		$scope.filtrosAplicar = function(){
			if($scope.titulo.length>=1 || $scope.datepicker.val()){
				$scope.xpos = 0;
				$scope.init();				
			}
			else {
				$scope.alertColor = 'red';
				$scope.alertText  = 'Debe completar los campos Titulo o Fecha para filtrar la tabla.';
			}
		};

		$scope.filtrosCancelar = function(){
			$scope.xpos=0;
			$scope.titulo = '';
			$scope.datepicker.val('');
			$scope.init();
		};

		$scope.init = function(){
			titulo = 'false';
			fecha  = 'false';
			if($scope.titulo.length>=1) titulo = $scope.titulo;
			if($scope.datepicker.val()) {
				x = $scope.datepicker.val().split('/');
				fecha = x[2]+'-'+x[1]+'-'+x[0];
			}
			$http.get('models/partes.php/partes/'+$scope.xpos+'/'+titulo+'/'+fecha+'/'+$scope.categoriaId)
				.success(function(json){
					$scope.xback  = json.xback;
					$scope.xnext  = json.xnext;
					$scope.xlast  = json.xlast;
					$scope.partes = json.partes;

					if((json.filtros.titulo.length>=1) && json.filtros.titulo!='false'){
						$scope.titulo = json.filtros.titulo;
						$scope.tituloDisplay = json.filtros.titulo;
					}
			        
				})
				.error(function(){
					$location.path('/login');
				});
		};

		$scope.first = function(){
			$scope.xpos = 0;
			$session.autorize(function(){
				$scope.init();
			});
		};

		$scope.back  = function(){
			$scope.xpos = $scope.xback;
			$session.autorize(function(){
				$scope.init();
			});
		};

		$scope.next  = function(){
			$scope.xpos = $scope.xnext;
			$session.autorize(function(){
				$scope.init();
			});
		};

		$scope.last  = function(){
			$scope.xpos = $scope.xlast;
			$session.autorize(function(){
				$scope.init();
			});
		};

		$scope.nuevo = function(){
			$location.path('/partes/nuevo');
		};

		$scope.visualizar = function(id){
			$location.path('/partes/visualizar/'+id);
		};

		$scope.modificar = function(id){
			if(id>=1){
				if(confirm('¿Esta seguro que desea modificar este registro?')){
					$location.path('/partes/modificar/'+id);
				}
			}
		}

		$scope.estado   = function(id){
			if(id>=1){
				if(confirm('¿Esta seguro que desea cambiar el estado de este registro?')){
					$session.autorize(function(){
						$http.put('models/partes.php/parte/'+id+'/estado')
							.success(function(json){
								if(json.result){
									$scope.init();
								}
							})
							.error(function(){
								$session.destroy();
							});s
					});
				}
			}
		};

		$scope.eliminar = function(id){
			if(id>=1){
				if(confirm('¿Esta seguro que desea eliminar este registro?')){
					$session.autorize(function(){
						$http.delete('models/partes.php/parte/'+id)
							.success(function(json){
								if(json.result){
									$scope.init();
								}
							})
							.error(function(){
								$session.destroy();
							});
					});
				}
			}
		};

		$session.autorize(function(){
			$session.mainmenu();
			$scope.init();
		});

	});