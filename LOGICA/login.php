<?php
// Este archivo comprueba que las credenciales coincidan y verifica que la cuenta no esté dada de baja (estado = 1)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conexion.php';

$email = $_POST['email'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

if (empty($email) || empty($contrasena)) {
    echo json_encode(["status" => "error", "message" => "Campos obligatorios vacíos."]);
    exit;
}

// Consultamos al usuario buscando también su estado activo
$query = "SELECT * FROM usuarios WHERE email = '$email' AND estado = 1";
$resultado = mysqli_query($conexion, $query);

if ($resultado && mysqli_num_rows($resultado) > 0) {
    $user = mysqli_fetch_assoc($resultado);
    
    // Verificamos si el hash de la contraseña coincide
    if (password_verify($contrasena, $user['contrasena'])) {
        // No enviamos la contraseña de vuelta al cliente por seguridad
        unset($user['contrasena']);
        echo json_encode(["status" => "success", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "message" => "Contraseña incorrecta."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "El usuario no existe o está inactivo."]);
}
?>