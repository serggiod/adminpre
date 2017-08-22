angular
    .module('legapp')
    .controller('partesNuevo', function($scope, $location, $http, $session) {

        $scope.init = function() {
            $session.autorize(function() {
                $scope.date = new Date();
                $scope.volanta = '';
                $scope.titulo = '';
                $scope.bajada = '';
                $scope.cabeza = '';
                $scope.cuerpo = '';
                $scope.dia = $scope.date.getDate();
                $scope.mes = $scope.date.getMonth() + 1;
                $scope.anio = $scope.date.getFullYear();
                $scope.hora = $scope.date.getHours();
                $scope.minuto = $scope.date.getMinutes();
                $scope.segundo = $scope.date.getSeconds();
                $scope.alert = {
                    type: 'yellow',
                    text: 'Complete el siguiente formulario para ingresar un nuevo parte de prensa.'
                };
                $scope.toolbar = [
                    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
                    ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull']
                ];
                $('#fotoprogress').hide();
            });
        };

        $scope.cancelar = function() {
            $location.path('/partes');
        };

        $scope.aceptar = function() {
            $session.autorize(function() {
                json = {
                    volanta: $scope.volanta,
                    titulo: $scope.titulo,
                    bajada: $scope.bajada,
                    cabeza: $scope.cabeza,
                    cuerpo: $scope.cuerpo,
                    fecha: $scope.anio + '-' + $scope.mes + '-' + $scope.dia,
                    hora: $scope.hora + ':' + $scope.minuto + ':' + $scope.segundo
                };
                url = '/rest/ful/adminpre/index.php/parte';
                $http
                    .post(url, json)
                    .success(function(json) {
                        if (json.result) {
                            $scope.alert.type = 'green';
                            $scope.alert.text = 'El parte de prensa se ha ingresado en forma correcta.';
                            $location.path('/partes');
                        } else {
                            $scope.alert.type = 'red';
                            $scope.alert.text = 'El parte de prensa no se ha ingresado en forma correcta.';
                        }
                    });
            });
        };

        $scope.subir = function() {
            $session.autorize(function() {
                if (($scope.titulo.length >= 1) && ($scope.cabeza.length >= 1)) {
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
                            $('#fotoprogress').show();
                            reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.addEventListener('loadend', function(object) {
                                if (reader.readyState === 2) {
                                    img = document.createElement('img');
                                    img.src = reader.result;
                                    img.addEventListener('load', function() {
                                        canvas = document.createElement('canvas');
                                        canvas.width = 450;
                                        canvas.height = parseInt(((parseInt(((100 * canvas.width) / img.width))) * img.height) / 100);
                                        context = canvas.getContext('2d');
                                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                                        archivo = canvas.toBlob(function(imagejpg) {
                                            var form = new FormData;
                                            form.append('titulo', $scope.titulo);
                                            form.append('texto', $scope.cabeza);
                                            form.append('fecha', $scope.anio + '-' + $scope.mes + '-' + $scope.dia);
                                            form.append('archivo', imagejpg);
                                            $.ajax({
                                                url: '/rest/ful/adminpre/index.php/parte/fotografia',
                                                type: 'POST',
                                                processData: false,
                                                contentType: false,
                                                data: form,
                                                success: function(json) {
                                                    if (json.result) {
                                                        img = '<a ';
                                                        img += 'id="' + json.fotoId + json.partesFotoId + '" ';
                                                        img += 'class="glyphicon glyphicon-remove-sign" style="cursor:pointer;" href="javascript: window.removeFotografia(' + json.fotoId + ',' + json.partesFotoId + ',\'' + json.archivo + '\')">';
                                                        img += '<img ';
                                                        img += 'src="http://www.legislaturajujuy.gov.ar/img/fotografias/' + json.archivo + '" ';
                                                        img += 'width="120" style="margin:5px;float:left;"/>';
                                                        img += '</a>';
                                                        $('#fotografiasDisplay').append(img);
                                                        $('#fotoprogress').hide();
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
                            $('#fotoprogress').false();
                        }
                    });
                } else {
                    $scope.alert.type = 'red';
                    $scope.alert.text = 'Primero debe completar el formulario.';
                }
            });
        };

        $scope.init();

    });