angular
    .module('legapp')
    .controller('partesNuevo', function($scope, $location, $http, $session) {

        $scope.init = function() {
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
        };

        $scope.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull']
        ];

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
                $http.post('models/partes.php/parte', json)
                    .success(function(json) {
                        if (json.result) {
                            $scope.alert.type = 'green';
                            $scope.alert.text = 'El parte de prensa se ha ingresado en forma correcta.';
                            $location.path('/partes');
                        } else {
                            $scope.alert.type = 'red';
                            $scope.alert.text = 'El parte de prensa no se ha ingresado en forma correcta.';
                        }
                    })
                    .error(function() {
                        $session.destroy();
                    });
            });
        };

        $scope.subir = function() {
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
            } else {
                $scope.alert.type = 'red';
                $scope.alert.text = 'Primero debe completar el formulario.';
            }
        };

        $session.autorize(function() {
            $scope.init();
        });

    });

window.removeFotografia = function(f, pf, a) {
    $.ajax({
        url: 'models/partes.php/parte/fotografia/' + f + '/' + pf + '/' + a,
        type: 'DELETE',
        processData: false,
        contentType: false,
        success: function(j) {
            json = JSON.parse(j);
            if (json.result) {
                $('#' + f + pf).remove();
            }
        },
        error: function() { window.location.href = '#/login'; }
    });
};