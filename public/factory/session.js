angular
    .module('adminpre')
    .factory('$session',function($http,$location,Session){
    
        return {
            start:function(){
                date = new Date();
                sessionStorage.setItem('loggedin',true);
                sessionStorage.setItem('loggeddate',date.valueOf());
                sessionStorage.setItem('user',{});
            },
            destroy:function(){
                sessionStorage.setItem('loggedin',null);
                sessionStorage.setItem('loggeddate',null);
                sessionStorage.setItem('user',{});
                Session = {};
                $location.path('/login');
            },
            autorize:function(promise){
                $this = this;
                loggedin = sessionStorage.getItem('loggedin');
                console.log(loggedin);   
                if(loggedin===true){

                    //date = new Date();
                    //diff = Math.abs(date.valueOf() - $this.logged.date);
                    //console.log(diff);
                    promise();

                    /*
                    if(diff <= 3600){
                    
                    $http.get('models/login.php/sessionStorage')
                    .success(function(json,status){
                        if(status===200){
                            if(json.result){
                                $this.logged.date = new Date();
                                //promise();

                            }

                            else {
                                $this.destroy();
                            }
                        } 

                        else {
                            $this.destroy();
                        }
                    })
                    .error(function(){
                        $this.destroy();
                    });
                    */

                }

                else {
                    $this.destroy();
                }
            },
            get:function(key){
                return Session[key];
            },
            set:function(key,value){
                Session[key] = value;
            }
        };

    });