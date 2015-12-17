<?php

# Requerir archivo base..
require_once 'base.php';

# Peticion POST.
$app->post('/',function($request) use ($db,$app,$main) {

	# Optener variables.
	$json     = json_decode($request->getBody());
	$usuario  = filter_var($json->user,FILTER_SANITIZE_STRING);
	$password = filter_var($json->pass,FILTER_SANITIZE_STRING);
	
	// Chequear si el usuario esta habilitado.
	$sql   = $db->select()
		->from('usuarios')
		->where('usuario','=',$usuario)
		->where('password','=',$password)
		->where('estado','=','1')
		->where('app','=','adminpre');
	$query = $sql->execute();
	$user  = $query->fetch();

	if(is_array($user) && count($user)){

		# Guardar sesion.
		$_SESSION['userid']     = $user['id'];
		$_SESSION['loggedin']   = true;
		$_SESSION['loggedtime'] = time();

		unset($user[0]);
		unset($user[1]);
		unset($user[2]);
		unset($user[3]);
		unset($user[4]);
		unset($user[5]);
		unset($user[6]);
		unset($user[7]);
		unset($user[8]);
		unset($user[9]);

		unset($user['password']);
		unset($user['roles_id']);
		unset($user['user_dir']);
		unset($user['user_url']);
		unset($user['estado']);
		unset($user['app']);
		unset($user['roles_id']);
		
		echo json_encode($user);

	} else {

		$main->error404();

	}

});

$app->delete('/logout',function() use ($app,$db,$main){
	$json = json_encode(array('result'=>$main->loggedOut()));
	error_log($json);
	echo $json;
});

$app->put('/password',function($request) use ($app,$db,$main){

	# Optener variables.
	$json       = json_decode($request->getBody());
	$password   = filter_var($json->pass,FILTER_SANITIZE_STRING);
	$repassword = filter_var($json->repass,FILTER_SANITIZE_STRING);

	if($password===$repassword){

		$sql = $db->update(array('password'=>$password))
			 ->table('usuarios')
			 ->where('id','=',$_SESSION['userid']);
		$user = $sql->execute();
		
		if($user){
			echo json_encode(array('result'=>true));
		} else {
			echo json_encode(array('result'=>false));
		}

	} else {
		$main->error404();
	}

});

// Salida del Framewrok.
$app->run();