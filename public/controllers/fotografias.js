angular
	.module('adminpre')
	.controller('fotografias',function($scope,$location,$http,$routeParams){
		$scope.subir = function(){
			archivos = $('#archivos');
			archivos.click();
			archivos.on('change',function(){
				archivos = this.files;
				for(i=0;i<archivos.length;i++){
					type = archivos[i].type.split('/');
					if(type==='image'){

						form = new FormData;
						form.append('titulo',archivos[i]);
						form.append('archivo',archivos[i]);

						$.ajax({
						    url	:'models/partes.php/parte/fotografia',	
						    type:'POST',
						    processData:false,
                            contentType:false,
						    data:form,
						    success:function(json){
						        if(json.result){
						             window.location.href = 'untitled.html';
						        }
						    },
						    error:function(){ $location.path('/login'); },
						});

					}
				}
			})
		};
	});