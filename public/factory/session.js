angular
    .module('adminpre')
    .factory('$session',function($http,$location){
    
        return {
            start:function(user){
                date = new Date();
                sessionStorage.setItem('loggedin',true);
                sessionStorage.setItem('loggeddate',date.valueOf());
                sessionStorage.setItem('user',JSON.stringify(user));
            },
            destroy:function(){
                sessionStorage.setItem('loggedin',null);
                sessionStorage.setItem('loggeddate',null);
                sessionStorage.setItem('user',null);
                for(i in sessionStorage){
                    delete sessionStorage[i];
                }
                $location.path('/login');
            },
            autorize:function(promise){
                $this = this;
                loggedin = eval(sessionStorage.getItem('loggedin'));
                if(loggedin===true){
                    date = new Date();
                    diff = (date.valueOf() - parseInt(sessionStorage.getItem('loggeddate'))) / 1000;
                    if(diff <= 3600){
                        $http.get('models/login.php/session')
                        .success(function(json){
                            if(json.result){
                                date = new Date();
                                sessionStorage.setItem('loggeddate',date.valueOf());
                                promise();
                            }
                            else {
                                $this.destroy();
                            }
                        })
                        .error(function(){
                            $this.destroy();
                        });
                    }
                    else {
                        $this.destroy();    
                    }
                }
                else {
                    $this.destroy();
                }
            },
            get:function(key){
                return sessionStorage.getItem(key);
            },
            set:function(key,value){
                sessionStorage.setItem(key,value);
            },
            getUser:function(){
                return JSON.parse(sessionStorage.getItem('user'));
            },
            mainmenu:function(){
                $('.loading').hide();
                $.get('views/menu.html',function(html){
                    user = JSON.parse(sessionStorage.getItem('user'));
                    $('#navbar-logo').html('LEGISLATURA | '+user.nombre);
                    $('#mainmenu').html(html);
                    $("#menuArchivoMain").dropdown();
                    $("#menuHerramientasMain").dropdown();
                    $("#menuAyudaMain").dropdown();
                });
            }
        };

    });