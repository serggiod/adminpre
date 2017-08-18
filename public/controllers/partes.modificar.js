angular
    .module('legapp')
    .controller('partesModificar', function($scope, $location, $http, $routeParams, $session) {

        $scope.init = function() {
            $session.init();
            $scope.id = $routeParams.id;
            $scope.alert = {};
            $scope.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull']
            ];
            $http.get('models/partes.php/parte/' + $scope.id)
                .success(function(json) {
                    $scope.volanta = json.volanta;
                    $scope.titulo = json.titulo;
                    $scope.bajada = json.bajada;
                    $scope.cabeza = json.cabeza;
                    $scope.cuerpo = json.cuerpo;
                    $scope.dia = parseInt(json.dia);
                    $scope.mes = parseInt(json.mes);
                    $scope.anio = parseInt(json.anio);
                    $scope.hora = parseInt(json.hora);
                    $scope.minuto = parseInt(json.minuto);
                    $scope.segundo = parseInt(json.segundo);
                    $http.get('models/partes.php/parte/fotografias/' + $scope.id)
                        .success(function(json) {
                            $scope.fotografias = json;
                            $scope.alert.type = 'yellow';
                            $scope.alert.text = 'Cambie los datos para modificar el parte de prensa.';
                        })
                        .error(function() {
                            $session.destroy();
                        });
                })
                .error(function() {
                    $session.destroy();
                });
        };

        $scope.cancelar = function() {
            $location.path('/partes');
        };

        $scope.aceptar = function() {
            //$session.autorize(function(){
            json = {
                volanta: $scope.volanta,
                titulo: $scope.titulo,
                bajada: $scope.bajada,
                fecha: $scope.anio + '-' + $scope.mes + '-' + $scope.dia,
                hora: $scope.hora + ':' + $scope.minuto + ':' + $scope.segundo
            };
            $http.put('models/partes.php/parte/' + $scope.id, json)
                .success(function(json) {
                    $('#loading').hide();
                    if (json.result) {
                        $location.path('/partes');
                    } else {
                        $scope.alert.type = 'red';
                        $scope.alert.text = 'Se detecto un error.';
                    }
                })
                .error(function() {
                    $session.destroy();
                });
            //});
        };

        $scope.subir = function() {
            var input = document.createElement('input');
            input.multiple = false;
            input.type = 'file';
            input.lang = 'es';
            input.accept = 'image/*';
            input.click();
            input.addEventListener('change', () => {
                var file = input.files[0];
                var type = file.type;
                if (type.toString().substring(0, 5) === 'image') {
                    reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener('loadend', (object) => {
                        if (reader.readyState === 2) {
                            img = document.createElement('img');
                            img.src = reader.result;
                            img.addEventListener('load', () => {
                                canvas = document.createElement('canvas');
                                canvas.width = 450;
                                canvas.height = parseInt(((parseInt(((100 * canvas.width) / img.width))) * img.height) / 100);
                                context = canvas.getContext('2d');
                                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                                archivo = canvas.toBlob((imagejpg) => {
                                    var form = new FormData;
                                    form.append('parteid', $scope.id);
                                    form.append('titulo', $scope.titulo);
                                    form.append('texto', $scope.cabeza);
                                    form.append('fecha', $scope.anio + '-' + $scope.mes + '-' + $scope.dia);
                                    form.append('archivo', imagejpg);
                                    $.ajax({
                                        url: 'models/partes.php/parte/fotografia',
                                        type: 'POST',
                                        processData: false,
                                        contentType: false,
                                        data: form,
                                        success: function(j) {
                                            json = JSON.parse(j);
                                            if (json.result) {
                                                img = '<a ';
                                                img += 'id="' + json.fotoId + json.partesFotoId + '" ';
                                                img += 'class="glyphicon glyphicon-remove-sign" style="cursor:pointer;" href="javascript: window.removeFotografia(' + json.fotoId + ',' + json.partesFotoId + ',\'' + json.archivo + '\')">';
                                                img += '<img ';
                                                img += 'src="http://www.legislaturajujuy.gov.ar/img/fotografias/' + json.archivo + '" ';
                                                img += 'width="120" style="margin:5px;float:left;"/>';
                                                img += '</a>';
                                                $('#fotografiasDisplay').append(img);
                                            }
                                        },
                                        error: function() { $location.path('/login'); }
                                    });
                                }, 'image/jpeg', 0.90);
                            });
                        }
                    });
                } else {
                    $scope.alert.type = 'red';
                    $scope.alert.text = 'Solo puede subir imagenes.';
                }
            });
        };

        $scope.removeFotografia = function(f, pf, a) {
            $http.delete('models/partes.php/parte/fotografia/' + f + '/' + pf + '/' + a)
                .success(function(json) {
                    if (json.result) {
                        $('#' + f + pf).remove();
                    }
                })
                .error(function() {
                    $session.destroy();
                });
        };

        $scope.init();

    });