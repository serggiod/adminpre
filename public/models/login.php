<?php

# Requerir archivo base..
require_once 'base.php';

# Instancia de Zendframwork/zend-validation.
$filter = new Zend\Validator\StringLength(array('min'=>4,'max' => 32));

# Peticion POST.
$app->post('/',function($request) use ($db,$app,$main,$filter) {
	
	# Optener variables.
	$json     = json_decode($request->getBody());
	$usuario  = filter_var($json->user,FILTER_SANITIZE_STRING);
	$password = filter_var($json->pass,FILTER_SANITIZE_STRING);

	// Validar datos.
	if($filter->isValid($usuario) && $filter->isValid($password)){
		$sql   = $db->select()
			->from('usuarios')
			->where('usuario','=',$usuario)
			->where('password','=',$password)
			->where('estado','=','1')
			->where('app','=','adminpre');
		$query = $sql->execute();
		$user  = $query->fetch();
		if(is_array($user) && count($user) && $user['id']){
			$date                   = new DateTime();
			$_SESSION['loggedin']   = true;
			$_SESSION['loggeddate'] = $date->getTimestamp();
			$_SESSION['user']       = array(
				'id' => $user['id'],
				'nombre' => $user['nombre'].' '.$user['apellido']
			);
			echo json_encode(array('result'=>true,'user'=>$_SESSION['user']),JSON_FORCE_OBJECT);
		} else {
			$main->error404();
		}
	} else {
		$main->error404();
	}

});

$app->delete('/logout',function() use ($app,$db,$main){
	$json = json_encode(array('result'=>$main->loggedOut()));
	echo $json;
});

$app->put('/password',function($request) use ($app,$db,$main){
	if($main->sessionStatus()){
		$json       = json_decode($request->getBody());
		$password   = filter_var($json->pass,FILTER_SANITIZE_STRING);
		$repassword = filter_var($json->repass,FILTER_SANITIZE_STRING);

		if($password===$repassword){
			$sql = $db->update(array('password'=>$password))
				 ->table('usuarios')
				 ->where('id','=',$_SESSION['user']['id']);
			$user = $sql->execute();
			
			if($user) {
				echo json_encode(array('result'=>true));
			}

			else {
				echo json_encode(array('result'=>false));
			}
		}

		else {
			$main->error404();
		}
	}

	else {
		$main->error404();
	}
});


$app->get('/session',function() use ($app,$db,$main){
	$json = array(
		'result' => false
	);
	if(is_array($_SESSION) && (count($_SESSION) >= 3)){
		if($_SESSION['loggedin']){
			$date = new DateTime();
			$diff = ($date->getTimestamp() - intval($_SESSION['loggeddate'])) /1000;
			if($diff<=3600){
				$_SESSION['loggeddate'] = $date->getTimestamp();
				$json['result'] = true;
				echo json_encode($json,JSON_FORCE_OBJECT);
			}
			else {
				$main->error404();
			}
		}
		else{
			$main->error404();
		}
	}
	else {
		$main->error404();
	}
});

$app->run();