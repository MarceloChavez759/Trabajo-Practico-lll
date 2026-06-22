<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Conexión a la base de datos (Ajusta el nombre si es necesario)
$conn = new mysqli("localhost", "root", "", "edumetris_bd");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Conexión fallida a la base de datos."]);
    exit();
}

$id_usuario = $_POST['id_usuario'] ?? null;
$nombre = trim($_POST['nombre'] ?? '');
$docente = trim($_POST['docente'] ?? '');
$dificultad = $_POST['dificultad_estimada'] ?? null;

if (!$id_usuario || empty($nombre) || empty($docente) || !$dificultad) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
    exit();
}

// =========================================================================
// ACCIÓN 1: Verificar si la materia existe globalmente en la tabla 'materias'
// =========================================================================
$sql_materia = "SELECT id_materia FROM materias WHERE LOWER(nombre) = LOWER(?)";
$stmt_materia = $conn->prepare($sql_materia);
$stmt_materia->bind_param("s", $nombre);
$stmt_materia->execute();
$result_materia = $stmt_materia->get_result();

if ($result_materia->num_rows > 0) {
    // Si ya existe, tomamos su ID existente
    $row = $result_materia->fetch_assoc();
    $id_materia = $row['id_materia'];
} else {
    // Si no existe globalmente, la insertamos respetando tus columnas (image_0fe694.png)
    $sql_ins_mat = "INSERT INTO materias (nombre, docente, dificultad_estimada) VALUES (?, ?, ?)";
    $stmt_ins_mat = $conn->prepare($sql_ins_mat);
    $stmt_ins_mat->bind_param("ssi", $nombre, $docente, $dificultad);
    $stmt_ins_mat->execute();
    $id_materia = $stmt_ins_mat->insert_id;
    $stmt_ins_mat->close();
}
$stmt_materia->close();

// =========================================================================
// ACCIÓN 2: Verificar duplicado en la tabla intermedia (inscripciones)
// =========================================================================
// NOTA: Ajusta 'inscripciones' si tu tabla intermedia tiene otro nombre
$sql_check_ins = "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_materia = ?";
$stmt_check_ins = $conn->prepare($sql_check_ins);
$stmt_check_ins->bind_param("ii", $id_usuario, $id_materia);
$stmt_check_ins->execute();
$stmt_check_ins->store_result();

if ($stmt_check_ins->num_rows > 0) {
    // El usuario ya está inscrito en esta materia
    echo json_encode([
        "status" => "error", 
        "message" => "Ya te encuentras inscrito en la materia '" . $nombre . "'."
    ]);
    $stmt_check_ins->close();
    $conn->close();
    exit();
}
$stmt_check_ins->close();

// =========================================================================
// ACCIÓN 3: Realizar la inscripción en la tabla intermedia
// =========================================================================
$sql_insert_ins = "INSERT INTO inscripciones (id_usuario, id_materia) VALUES (?, ?)";
$stmt_insert_ins = $conn->prepare($sql_insert_ins);
$stmt_insert_ins->bind_param("ii", $id_usuario, $id_materia);

if ($stmt_insert_ins->execute()) {
    echo json_encode(["status" => "success", "message" => "Materia inscrita con éxito."]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo procesar la inscripción."]);
}

$stmt_insert_ins->close();
$conn->close();
?>