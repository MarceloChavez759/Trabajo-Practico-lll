<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "edumetris_bd";

$conexion = mysqli_connect($host, $user, $pass, $db);

if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}
// Configuración para que reconozca tildes de la base de datos
mysqli_set_charset($conexion, "utf8");
?>
