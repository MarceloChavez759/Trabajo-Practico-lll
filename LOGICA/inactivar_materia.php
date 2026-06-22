<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../conexion.php';

$id_materia = $_POST['id_materia'] ?? '';
$id_usuario = $_POST['id_usuario'] ?? '';

if (empty($id_materia) || empty($id_usuario)) {
    echo json_encode(["status" => "error", "message" => "Parámetros insuficientes."]);
    exit;
}

// Rompe la relación del alumno sin destruir la materia del sistema histórico
$query = "DELETE FROM inscripciones WHERE id_usuario = $id_usuario AND id_materia = $id_materia";

if (mysqli_query($conexion, $query)) {
    echo json_encode(["status" => "success", "message" => "Materia removida de tu lista."]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conexion)]);
}
?>