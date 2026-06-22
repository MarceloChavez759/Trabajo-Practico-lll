<?php
// 1. PERMISOS DE CONEXIÓN (CORS) - Esto debe ir al principio
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 2. INCLUIR CONEXIÓN
include '../conexion.php'; 

// 3. CONSULTA
$query = "SELECT id_rol, nombre FROM roles";
$resultado = mysqli_query($conexion, $query);

$roles = [];

if ($resultado) {
    while($row = mysqli_fetch_assoc($resultado)) {
        $roles[] = [
            'id_rol' => $row['id_rol'],
            'nombre' => $row['nombre']
        ];
    }
}

// 4. ENVIAR RESPUESTA
echo json_encode($roles);
?>