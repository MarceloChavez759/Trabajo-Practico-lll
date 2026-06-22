<?php
// Cambia el valor de la columna estado a 0. Así se simula el borrado sin destruir el registro físico para proteger el histórico analítico de la tesis.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conexion.php';

$id_usuario = $_POST['id_usuario'] ?? '';

if(empty($id_usuario)) {
    echo json_encode(["status" => "error", "message" => "ID no proveído."]);
    exit;
}

// Modificación de baja lógica: cambiamos el estado a 0
$query = "UPDATE usuarios SET estado = 0 WHERE id_usuario = $id_usuario";

if(mysqli_query($conexion, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conexion)]);
}
?>