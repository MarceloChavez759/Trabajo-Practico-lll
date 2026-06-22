<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../conexion.php';

$id_usuario = $_GET['id_usuario'] ?? '';

if (empty($id_usuario)) {
    echo json_encode([]);
    exit;
}

// Consulta relacional estricta basada en tu diagrama
$query = "SELECT m.id_materia, m.nombre, m.docente, m.dificultad_estimada 
          FROM materias m
          INNER JOIN inscripciones i ON m.id_materia = i.id_materia
          WHERE i.id_usuario = $id_usuario 
          ORDER BY m.id_materia DESC";

$resultado = mysqli_query($conexion, $query);

$materias = [];
if ($resultado) {
    while ($row = mysqli_fetch_assoc($resultado)) {
        $materias[] = $row;
    }
}

echo json_encode($materias);
?>