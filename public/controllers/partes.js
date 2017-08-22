angular
    .module('legapp')
    .controller('partes', function($scope, $location, $http, $session) {

        $scope.init = function() {
            $scope.display = true;
            $scope.loading = true;
            $scope.xpos = 0;
            $scope.titulo = '';
            $scope.fecha = '';
            $scope.datepicker = $('.datepicker').pickadate({
                monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
                weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
                weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                showMonthsShort: true,
                today: 'Hoy',
                clear: 'Borrar',
                close: 'Cerrar',
                firstDay: 1,
                format: 'dd/mm/yyyy',
                dateFormat: 'yyyy-mm-dd',
                formatSubmit: 'yyyy-mm-dd',
                selectMonths: true,
                selectYears: 20,
                closeOnSelect: true,
                onSet: function() {
                    this.close();
                }
            });
            $scope.getPartes();
        };

        $scope.getPartes = function() {
            $session.autorize(function() {
                $scope.loading = true;
                titulo = 'false';
                fecha = 'false';
                if ($scope.titulo != '') titulo = $scope.titulo;
                if ($scope.datepicker.val()) {
                    x = $scope.datepicker.val().split('/');
                    fecha = x[2] + '-' + x[1] + '-' + x[0];
                }
                url = '/rest/ful/adminpre/index.php/partes/' + $scope.xpos + '/' + titulo + '/' + fecha;
                $http.get(url)
                    .success(function(json) {
                        $scope.xback = json.xback;
                        $scope.xnext = json.xnext;
                        $scope.xlast = json.xlast;
                        $scope.partes = json.partes;
                        $scope.loading = false;
                    });
            });
        };

        $scope.filtrosAplicar = function() {
            if ($scope.titulo.length != 'false' || $scope.datepicker.val()) $scope.getPartes();
            else alert('Debe completar los campos Titulo o Fecha para filtrar la tabla.');
        };

        $scope.filtrosCancelar = function() {
            $scope.xpos = 0;
            $scope.titulo = '';
            $scope.fecha = '';
            $scope.datepicker.val('');
            $scope.getPartes();
        };

        $scope.first = function() {
            $scope.xpos = 0;
            $scope.getPartes();
        };

        $scope.back = function() {
            $scope.xpos = $scope.xback;
            $scope.getPartes();
        };

        $scope.next = function() {
            $scope.xpos = $scope.xnext;
            $scope.getPartes();
        };

        $scope.last = function() {
            $scope.xpos = $scope.xlast;
            $scope.getPartes();
        };

        $scope.nuevo = function() {
            $location.path('/partes/nuevo');
        };

        $scope.visualizar = function(id) {
            $location.path('/partes/visualizar/' + id);
        };

        $scope.modificar = function(id) {
            if (id >= 1) {
                if (confirm('¿Esta seguro que desea modificar este registro?')) {
                    $location.path('/partes/modificar/' + id);
                }
            }
        }

        $scope.estado = function(id) {
            $session.autorize(function() {
                if (id >= 1) {
                    if (confirm('¿Esta seguro que desea cambiar el estado de este registro?')) {
                        $http
                            .put('/rest/ful/adminpre/index.php/parte/' + id + '/estado')
                            .success(function(json) {
                                if (json.result === true) $scope.getPartes();
                            });
                    }
                }
            });
        };

        $scope.eliminar = function(id) {
            $session.autorize(function() {
                if (id >= 1) {
                    if (confirm('¿Esta seguro que desea eliminar este registro?')) {
                        $http
                            .delete('/rest/ful/adminpre/index.php/parte/' + id)
                            .success(function(json) {
                                if (json.result === true) $scope.getPartes();
                            });

                    }
                }
            });
        };

        $scope.init();

    });

window.removeFotografia = function(f, pf, a) {
    $('#fotoprogress').show();
    $.ajax({
        url: '/rest/ful/adminpre/index.php/parte/fotografia/' + f + '/' + pf + '/' + a,
        type: 'DELETE',
        processData: false,
        contentType: false,
        success: function(json) {
            if (json.result) {
                $('#' + f + pf).remove();
                $('#fotoprogress').hide();
            }
        }
    });
};