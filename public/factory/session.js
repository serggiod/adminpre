angular
    .module('adminpre')
    .factory('$session',function($http,$location){
    return {
        data    : {},
        logged  : {},
        start:function(){
            $this        = this;
            $this.data   = {};
            $this.logged = {};

            date = new Date();
            $this.logged.in = true;
            $this.logged.time = date.getDate();
        },
        destroy:function(){
            $this        = this;
            $this.data   = {};
            $this.logged = {};
            $location.path('/login');
        },
        autorize:function(promise){
            $this=this;

            ndate = new Date();
            odate = new Date($this.logged.time);

            if($this.logged.in===true){
                ddate = Math.abs(ndate - odate);
                
                if(ddate <= 3600000){
                    $http.post('models/login.php/session',$this.logged)
                    .success(function(json,status){
                        if(status===200){
                            if(json.result){
                                $this.logger.time = ndate.getDate();
                                promise();
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
            $this = this;
            return $this.data[key];
        },
        set:function(key,value){
            $this = this;
            $this.data.key = value;
        }
    }
});