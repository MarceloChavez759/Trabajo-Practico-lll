<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../conexion.php';

// Recibir los datos enviados por el formulario
$nombre     = $_POST['nombre'] ?? '';
$email      = $_POST['email'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';
$edad       = $_POST['edad'] ?? 0;
$carrera    = $_POST['carrera'] ?? '';
$id_rol     = $_POST['id_rol'] ?? '';

// 1. Validar que los campos obligatorios no estén vacíos
if (empty($nombre) || empty($email) || empty($contrasena) || empty($id_rol)) {
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios"]);
    exit;
}

// 2. Encriptar la contraseña por seguridad
$pass_encriptada = password_hash($contrasena, PASSWORD_BCRYPT);

// 3. Insertar en la tabla USUARIOS
$query_user = "INSERT INTO usuarios (nombre, email, contrasena, edad, carrera) 
               VALUES ('$nombre', '$email', '$pass_encriptada', $edad, '$carrera')";

if (mysqli_query($conexion, $query_user)) {
    $id_usuario_nuevo = mysqli_insert_id($conexion); // Obtenemos el ID que se acaba de crear

    // 4. Como tu base de datos usa una tabla intermedia para roles (usuario_rol)
    // Vamos a insertar la relación aquí
    $query_rol = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES ($id_usuario_nuevo, $id_rol)";
    
    if (mysqli_query($conexion, $query_rol)) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al asignar el rol"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error al crear el usuario: " . mysqli_error($conexion)]);
}
?>