<?php
// Actualiza el perfil del usuario con los datos enviados desde el formulario de edición. Se espera recibir id_usuario, nombre, carrera y edad. El campo email no se puede modificar desde aquí. 
// Modifica el registro corespondiente en la tabla usuarios con un UPDATE. Devuelve un JSON indicando éxito o error.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conexion.php';

$id_usuario = $_POST['id_usuario'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$carrera = $_POST['carrera'] ?? '';
$edad = $_POST['edad'] ?? 0;

if(empty($id_usuario) || empty($nombre)) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros."]);
    exit;
}

// Ejecución del UPDATE sobre la tabla usuarios
$query = "UPDATE usuarios SET nombre = '$nombre', carrera = '$carrera', edad = $edad WHERE id_usuario = $id_usuario";

if(mysqli_query($conexion, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conexion)]);
}
?>