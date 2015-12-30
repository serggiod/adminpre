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
			->orderBy('p.hora','desc')
			->limit(0,10);
	$query  = $sql->execute();
	$partes = $query->fetchAll();

	echo json_encode($partes,JSON_FORCE_OBJECT);
});

// Peticion POST
$app->post('/parte',function($request,$response,$args) use ($app,$db,$main){
	
	$json     = json_decode($request->getBody());
	$volanta  = filter_var($json->volanta,FILTER_SANITIZE_STRING);
	$titulo   = filter_var($json->titulo,FILTER_SANITIZE_STRING);
	$bajada   = filter_var($json->bajada,FILTER_SANITIZE_STRING);
	$cabeza   = filter_var($json->cabeza,FILTER_SANITIZE_STRING);
	$cuerpo   = filter_var($json->cuerpo,FILTER_SANITIZE_STRING);
	$fecha    = date('Y-m-d',strtotime(filter_var($json->fecha,FILTER_SANITIZE_STRING)));
	$hora     = date('h:m:s',strtotime(filter_var($json->hora,FILTER_SANITIZE_STRING)));

	// Intertar una noticia en fotografias.
	$sql = $db->insert(array('volanta','titulo','bajada','cabeza','cuerpo','fecha','hora','estado'))
        ->into('partes')
        ->values(array($volanta,$titulo,$bajada,$cabeza,$cuerpo,$fecha,$hora,0));
    
    $partesId = $sql->execute();

	if($partesId){

		// Relacionar las fotografias con la noticia.
		$sql = $db->update()
			->table('partes_fotografias')
			->set(array('parte_id'=>$partesId))
			->whereNull('parte_id');

		$affecedRows = $sql->execute();

		if($affecedRows) {
			echo json_encode(array('result'=>true));
		} else {
			echo json_encode(array('result'=>false));
		}
		
	} else {
		echo json_encode(array('result'=>false));
	}

});

// Peticion PUT
$app->put('/parte/{id}',function($request,$response,$args) use ($app,$db,$main){

	$id       = filter_var($args['id'],FILTER_SANITIZE_NUMBER_INT);

	if($id){

		$json     = json_decode($request->getBody());
		$volanta  = filter_var($json->volanta,FILTER_SANITIZE_STRING);
		$titulo   = filter_var($json->titulo,FILTER_SANITIZE_STRING);
		$bajada   = filter_var($json->bajada,FILTER_SANITIZE_STRING);
		$cabeza   = filter_var($json->cabeza,FILTER_SANITIZE_STRING);
		$cuerpo   = filter_var($json->cuerpo,FILTER_SANITIZE_STRING);
		$fecha    = date('Y-m-d',strtotime(filter_var($json->fecha,FILTER_SANITIZE_STRING)));
		$hora     = date('h:m:s',strtotime(filter_var($json->hora,FILTER_SANITIZE_STRING)));

		$sql = $db->update(array(
				'volanta' => $volanta,
				'titulo'  => $titulo,
				'bajada'  => $bajada,
				'cabeza'  => $cabeza,
				'cuerpo'  => $cuerpo,
				'fecha'   => $fecha,
				'hora'    => $hora
			))
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

// Peticion GET.
$app->get('/parte/{id}',function($request,$response,$args) use ($db,$app,$main) {

	$id     = filter_var($args['id'],FILTER_SANITIZE_NUMBER_INT);

	$sql    = $db->select(array(
				"p.volanta volanta",
				"p.titulo titulo",
				"p.bajada bajada",
				"p.cabeza cabeza",
				"p.cuerpo cuerpo",
				"date_format(p.fecha,'%d-%m-%Y') fecha",
				"p.hora hora",
				"p.estado estado"
			))
			->from('partes p')
			->where('p.id','=',$id);
	$query  = $sql->execute();
	$parte = $query->fetch();

	echo json_encode($parte,JSON_FORCE_OBJECT);
});

// Peticion PUT estado
$app->put('/parte/{id}/estado',function($request,$response,$args) use ($app,$db,$main){

	$id = filter_var($args['id'],FILTER_SANITIZE_NUMBER_INT);

	if($id){
		$sql   = $db->select(array('estado'))
			->from('partes')
			->where('id','=',$id);
		$query = $sql->execute();
		$parte = $query->fetch();

		$sql = null;

		if($parte['estado']){
			$sql = $db->update(array('estado'=>0,'estado_in'=>'NULL'))
				->table('partes')
				->where('id','=',$id);
		} else {
			$sql = $db->update(array('estado'=>1,'estado_in'=>date('Y-m-d h:i:s')))
				->table('partes')
				->where('id','=',$id);
		}
		
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

	$id = filter_var($args['id'],FILTER_SANITIZE_NUMBER_INT);

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


// GET: Imprime json con lista de fotografias relacioanda a un parte.
$app->get('/parte/fotografias/{parteId}', function($request,$response,$args) use ($app,$db,$main){

	$parteId = filter_var($args['parteId'],FILTER_SANITIZE_NUMBER_INT);
	error_log($parteId);
	if($parteId){
		
		$sql = $db->select(array('fotografias.id id','partes_fotografias.id parteid','fotografias.archivo archivo'))
			->from('partes_fotografias')
			->join('fotografias','fotografias.id','=','partes_fotografias.fotografia_id')
			->where('partes_fotografias.parte_id','=',$parteId);
		$query = $sql->execute();
		$fotos = $query->fetchAll();

		if($fotos){
			$json = array();
			foreach ($fotos as $f) {
				$json[] = array(
					'id'=>$f['id'],
					'parteid'=>$f['parteid'],
					'archivo'=>$f['archivo']
				);
			}
			echo json_encode($json,JSON_FORCE_OBJECT);
		} else {
			$main->error404();
		}

	} else {
		$main->error404();
	}
});

// POST: Formulario Nuevo: insertar fotografias.
$app->post('/parte/fotografia', function($request,$response,$args) use ($app,$db,$main){

	if($_FILES['archivo']['name']){

		$parteId = filter_input(INPUT_POST,'parteid',FILTER_SANITIZE_NUMBER_INT);
		$titulo = filter_input(INPUT_POST,'titulo',FILTER_SANITIZE_STRING);
		$texto  = filter_input(INPUT_POST,'texto',FILTER_SANITIZE_STRING);
		$fecha  = date('Y-m-d',strtotime(filter_input(INPUT_POST,'fecha',FILTER_SANITIZE_STRING)));
		$tmp    = $_FILES['archivo']['tmp_name'];
		$file   = str_replace(array('.',' '),array('-','-'),microtime()).'-'.$_FILES['archivo']['name'];
		$name   = '/var/www/html/public/img/fotografias/'.$file;

		// Mover un archivo temporal al directorio de fotografias.
		if(move_uploaded_file($tmp,$name)){

			// Insertar el nombre del archivo en la tabla fotografias.
			$sql = $db->insert(array('titulo','archivo','texto','fecha','autor','estado'))
		        ->into('fotografias')
		        ->values(array($titulo,$file,$texto,$fecha,'Direccionde Prensa de la Legislatura de Jujuy',1));
		    $fotografiasId = $sql->execute();

			if($fotografiasId){

				// Insertar en la tabla partes fotografias una relacion con fotografias.
				$partesFotografiasId = false;

				if($parteId){
					$sql = $db->insert(array('parte_id','fotografia_id','orden'))
				        ->into('partes_fotografias')
				        ->values(array($parteId,$fotografiasId,1));
				    $partesFotografiasId = $sql->execute();
				} else {
					$sql = $db->insert(array('fotografia_id','orden'))
				        ->into('partes_fotografias')
				        ->values(array($fotografiasId,1));
				    $partesFotografiasId = $sql->execute();
				}

				if($partesFotografiasId){
					echo json_encode(array('result'=>true,'fotoId'=>$fotografiasId,'partesFotoId'=>$partesFotografiasId,'archivo'=>$file),JSON_FORCE_OBJECT);
				} else {
					echo json_encode(array('result'=>false),JSON_FORCE_OBJECT);
				}
			}

		}

	} else {
		$main->error404();
	}

});

//http://localhost/adminpre/models/partes.php/parte/fotografia/2119/1181/0-18736900-1450787077-1.png
// DELETE: Formulario Nuevo: Remover Fotografias.
$app->delete('/parte/fotografia/{fotoId}/{parteFotoId}/{archivo}',function($request,$response,$args) use ($app,$db,$main){

	$fotoId       = filter_var($args['fotoId'],FILTER_SANITIZE_NUMBER_INT);
	$parteFotoId  = filter_var($args['parteFotoId'],FILTER_SANITIZE_NUMBER_INT);
	$archivo      = filter_var($args['archivo'],FILTER_SANITIZE_STRING);

	if($fotoId && $archivo){

		// Elimina un registro de la tabla fotografias.		
		$sql = $db->delete()
			->from('fotografias')
			->where('id','=',$fotoId);
		$affecedRows = $sql->execute();

		if($affecedRows){

			// Elimina un registro relacionado en la tabla partes_fotografias.
			$sql = $db->delete()
				->from('partes_fotografias')
				->where('id','=',$parteFotoId);
			$affecedRows = $sql->execute();

			if($affecedRows){

				// Elimina el archivo relacionado con la tabla fotografias.
				if(unlink('/var/www/html/public/img/fotografias/'.$archivo)){
					echo json_encode(array('result'=>true),JSON_FORCE_OBJECT);
				} else {
					echo json_encode(array('result'=>false),JSON_FORCE_OBJECT);
				}

			} else {
				echo json_encode(array('result'=>false),JSON_FORCE_OBJECT);		
			}

		} else {
			echo json_encode(array('result'=>false),JSON_FORCE_OBJECT);
		}

	} else {
		$main->error404();
	}
});

// Salida del Framewrok.
$app->run();