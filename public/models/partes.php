<?php

# Requerir archivo base..
require_once 'base.php';

// Peticion GET.
$app->get('/partes',function() use ($db,$app,$main) {

	$sql    = $db->select(array(
				"p.id id",
				"p.titulo titulo",
				"date_format(p.fecha,'%d-%m-%Y') redactado",
				"date_format(p.estado_in,'%d-%m-%Y') publicado",
				"p.hora hora",
				"p.estado estado"
			))
			->from('partes p')
			->orderBy('p.fecha','desc')
			->limit(0,10);
	$query  = $sql->execute();
	$partes = $query->fetchAll();

	echo json_encode($partes,JSON_FORCE_OBJECT);
});

// Peticion POST
$app->post('/parte',function($request,$response,$args) use ($app,$db,$main){
	
});

// Peticion PUT estado
$app->put('/parte/{id}/estado',function($request,$response,$args) use ($app,$db,$main){

	$id = $args['id'];

	if($id){
		$sql   = $db->select(array('estado'))
			->from('partes')
			->where('id','=',$id);
		$query = $sql->execute();
		$parte = $query->fetch();

		$estado = 1;

		if($parte['estado']){
			$estado = 0;
		}

		$sql = $db->update(array('estado'=>$estado))
			->table('partes')
			->where('id','=',$id);
		
		if($sql->execute()){
			echo json_encode(array('result'=>true));
		} else {
			echo json_encode(array('result'=>false));
		}

	} else {

		$main->error404();

	}
});

// Peticion DELETE
$app->delete('/parte/{id}',function($request,$response,$args) use ($app,$db,$main){

	$id = $args['id'];
	if($id){

		$sql = $db->delete()
			->from('partes')
			->where('id','=',$id);
		$partes = $sql->execute();

		if($partes){
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