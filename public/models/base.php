<?php
// Inicio de session.
session_start();

// Requerir instacia de Wordpress.
require_once '../../vendor/autoload.php';

// Funciones.
class main {

	function loggedIn(){
	    $return = false;
	    $time   = time() - $_SESSION['loggedtime'];
	    if($_SESSION['loggedin'] && $time<=3600) $return = true;
	    return $return;
	}

	function loggedOut(){

		$_SESSION['loggedin']   = false;
		$_SESSION['loggedtime'] = null;
		unset($_SESSION);
		session_unset();
		session_destroy();
		return true;
	}

	function error404(){
		header("Status: 404 Not Found",true);
		header('HTTP/1.0 404 Not Found',true);
		header('Conection: close',true);
		die;
	}

}

// Instancia de main.
$main = new main();

// Instancia de Slim Framework.
$app = new \Slim\App;

// Instancia de las base de datos Slim.
$db  = new \Slim\PDO\Database('mysql:host=localhost;dbname=test;charset=utf8','test','test');