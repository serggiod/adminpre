<?php

# Requerir archivo base..
require_once 'base.php';


// Peticion PUT
$app->put('/parte/{id}',function($request,$response,$args) use ($app,$db,$main){

	$id       = filter_var($args['id'],FILTER_SANITIZE_NUMBER_INT);

	if($id){

		$json     = json_decode($request->getBody());
		$volanta  = filter_var($json->volanta,FILTER_SANITIZE_STRING);
		$titulo   = filter_var($json->titulo,FILTER_SANITIZE_STRING);
		$bajada   = htmlentities($json->bajada);
		$cabeza   = htmlentities($json->cabeza);
		$cuerpo   = filter_var($json->cuerpo,FILTER_SANITIZE_STRING);
		$fecha    = date('Y-m-d',strtotime(filter_var($json->fecha,FILTER_SANITIZE_STRING)));
		$hora     = date('h:i:s',strtotime(filter_var($json->hora,FILTER_SANITIZE_STRING)));

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
				"date_format(p.fecha,'%d') dia",
				"date_format(p.fecha,'%m') mes",
				"date_format(p.fecha,'%Y') anio",
				"date_format(p.hora,'%h') hora",
				"date_format(p.hora,'%i') minuto",
				"date_format(p.hora,'%s') segundo",
				"p.estado estado"
			))
			->from('partes p')
			->where('p.id','=',$id);
	$query  = $sql->execute();
	$parte = $query->fetch();
	$parte["cabeza"] = html_entity_decode($parte["cabeza"]);
	$parte[3] = html_entity_decode($parte[3]);
	$parte["cuerpo"] = html_entity_decode($parte["cuerpo"]);
	$parte[4] = html_entity_decode($parte[4]);
	echo json_encode($parte,JSON_FORCE_OBJECT);
});






// GET: Imprime json con lista de fotografias relacioanda a un parte.
$app->get('/parte/fotografias/{parteId}', function($request,$response,$args) use ($app,$db,$main){
	$parteId = filter_var($args['parteId'],FILTER_SANITIZE_NUMBER_INT);
	if($parteId){
		$sql = $db->select(array('fotografias.id id','partes_fotografias.id parteid','fotografias.archivo archivo'))
			->from('partes_fotografias')
			->join('fotografias','fotografias.id','=','partes_fotografias.fotografia_id')
			->where('partes_fotografias.parte_id','=',$parteId);
		$query = $sql->execute();
		$fotos = $query->fetchAll();
		$json = array();
		foreach ($fotos as $f) {
			$json[] = array(
				'id'=>$f['id'],
				'parteid'=>$f['parteid'],
				'archivo'=>$f['archivo']
			);
		}
		echo json_encode($json,JSON_FORCE_OBJECT);
	} 
	else {
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
		$file   = str_replace(array('.',' '),array('-','-'),microtime()).'-'.$_FILES['archivo']['name'].'.jpeg';
		$name   = '/var/www/html/img/fotografias/'.$file;

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
				if(unlink('/var/www/html/img/fotografias/'.$archivo)){
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