<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "clinicadental");

if($conn -> connect_error){
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $conn -> connect_error]);
    exit();
}

$action = $_GET['action'] ?? '';

switch($action){
    case 'obtener_usuario':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn->prepare("SELECT id_usuario, usuario, sexo, rol FROM usuario WHERE id_usuario = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc() ?: null); break;
        
    case 'registrar_usuario':
        $datos = json_decode(file_get_contents("php://input"), true);
        $usuario = $datos['usuario'] ?? '';
        $contra  = $datos['contra']  ?? '';
        $sexo = $datos['sexo'];
        $rol = $datos['rol'] ?? 'Asistente';

        $check = $conn -> prepare("SELECT id_usuario FROM usuario WHERE usuario = ?");
        $check -> bind_param("s", $usuario);
        $check -> execute();
        $check -> store_result();
        if($check -> num_rows > 0){
            echo json_encode(["error" => "duplicado", "mensaje" => "Ese nombre de usuario ya existe"]);
            $check -> close(); break;
        } $check -> close();

        $contra_hash = password_hash($contra, PASSWORD_BCRYPT);
        $stmt = $conn -> prepare("INSERT INTO usuario (usuario, contra, sexo, ultimo_acceso, rol) VALUES (?, ?, ?, NOW(), ?)");
        $stmt -> bind_param("ssss", $usuario, $contra_hash, $sexo, $rol);
        if($stmt -> execute()){ echo json_encode(["success" => true, "usuario" => $usuario, "sexo" => $sexo, "rol" => $rol]); } 
        else{ echo json_encode(["error" => $stmt -> error]); } break;

    case 'login_usuario':
        $datos = json_decode(file_get_contents("php://input"), true);
        $usuario = $datos['usuario'] ?? '';
        $contra  = $datos['contra']  ?? '';
        $sexo = $datos['sexo'] ?? '';

        $stmt = $conn -> prepare("SELECT id_usuario, usuario, contra, sexo, ultimo_acceso,rol FROM usuario WHERE usuario = ?");
        $stmt -> bind_param("s", $usuario);
        $stmt -> execute();
        $result = $stmt -> get_result();
        $user = $result -> fetch_assoc();

        if($user && password_verify($contra, $user['contra'])){ echo json_encode(["success" => true, "usuario" => $user['usuario'], 
            "rol" => $user['rol'], "id" => $user['id_usuario'], "sexo" => $user['sexo']]); } 
        else{ echo json_encode(["error" => "credenciales", "mensaje" => "Usuario o contraseña incorrectos"]); } break;

    case 'obtener_paciente':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn -> prepare("SELECT * FROM paciente WHERE id_paciente = ?");
        $stmt -> bind_param("i", $id);
        $stmt -> execute();
        $result = $stmt -> get_result();
        echo json_encode($result -> fetch_assoc() ?: null); break;

    case 'obtener_pacientes':
        $result = $conn -> query("SELECT * FROM paciente ORDER BY id_paciente ASC");
        $pacientes = [];
        while($row = $result -> fetch_assoc()) $pacientes[] = $row;
        echo json_encode($pacientes); break;

    case 'obtener_antecmed':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn -> prepare("SELECT * FROM antecmed WHERE id_paciente = ?");
        $stmt -> bind_param("i", $id);
        $stmt -> execute();
        $result = $stmt -> get_result();
        echo json_encode($result -> fetch_assoc() ?: null); break;

    case 'agregar_paciente':
        $datos = json_decode(file_get_contents("php://input"), true);
        $nombre = $datos['nombre'] ?? '';
        $fecha_nac = $datos['fecha_nac'] ?? '';
        $telefono = $datos['telefono'] ?? '';
        $correo = $datos['correo'] ?? '';
        $sexoRaw = $datos['sexo'] ?? '';
        $tipo_sangre = $datos['tipo_sangre'] ?? '';
        $direccion = $datos['direccion']   ?? '';
        $emergencia = $datos['emergencia']  ?? '';
        $fecha = date('Y-m-d');
        $estado = 'Activo';

        $sexo = ($sexoRaw === 'Masculino' || $sexoRaw === 'M') 
            ? 'Masculino' : (($sexoRaw === 'Femenino' || $sexoRaw === 'F') ? 'Femenino' : '');

        $check = $conn -> prepare("SELECT id_paciente FROM paciente WHERE correo = ? OR telefono = ?");
        $check -> bind_param("ss", $correo, $telefono);
        $check -> execute();
        $check -> store_result();
        if($check -> num_rows > 0){
            http_response_code(409);
            echo json_encode(["error" => "duplicado", "mensaje" => "Ya existe un paciente con ese correo o teléfono"]);
            $check -> close(); break;
        } $check -> close();

        $stmt = $conn -> prepare("
            INSERT INTO paciente 
            (nombre, fecha_nac, telefono, correo, sexo, tipo_sangre, direccion, tel_emergencia, fecha, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt -> bind_param("ssssssssss",
            $nombre, $fecha_nac, $telefono, $correo, $sexo, 
            $tipo_sangre, $direccion, $emergencia, $fecha, $estado
        );

        if($stmt -> execute()){
            $id_paciente = $conn -> insert_id;
            $alergias = $datos['alergias'] ?? '';
            $med_act = $datos['med_act'] ?? '';
            $cir_prev = $datos['cir_prev'] ?? '';
            $enfermedades = $datos['enfermedades'] ?? '';
            $habitos = implode(', ', $datos['habitos'] ?? []);
            $id_usuario = $datos['id_usuario'] ?? 1;

            $stmt2 = $conn -> prepare("
                INSERT INTO antecmed  
                (id_paciente, id_usuario, alergias, med_act, cir_prev, enfermedades, habitos)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt2 -> bind_param("iisssss", $id_paciente, $id_usuario, $alergias, 
                $med_act, $cir_prev, $enfermedades, $habitos);
            if(!$stmt2 -> execute()){
                $conn -> query("DELETE FROM paciente WHERE id_paciente = $id_paciente");
                http_response_code(500);
                echo json_encode(["error" => "Error al guardar antecedentes: " . $stmt2 -> error]);
                break;
            } echo json_encode(["success" => true, "id_paciente" => $id_paciente, "sexo" => $sexo]);
        } else{ 
            http_response_code(500);
            echo json_encode(["error" => "Error al insertar: " . $stmt -> error]);
        }; break;

    case 'editar_paciente':
        $datos = json_decode(file_get_contents("php://input"), true);

        $id = $datos['id_paciente'] ?? 0;
        $nombre = $datos['nombre'] ?? '';
        $fecha_nac = $datos['fecha_nac'] ?? '';
        $telefono = $datos['telefono'] ?? '';
        $correo = $datos['correo'] ?? '';
        $sexo = $datos['sexo'] ?? '';
        $sexo = ($sexo === 'M') ? 'Masculino' : (($sexo === 'F') ? 'Femenino' : $sexo);
        $tipo_sangre = $datos['tipo_sangre'] ?? '';
        $direccion = $datos['direccion'] ?? '';
        $emergencia  = $datos['emergencia'] ?? '';

        $check = $conn -> prepare("SELECT id_paciente FROM paciente WHERE (correo = ? OR telefono = ?) AND id_paciente != ?");
        $check -> bind_param("ssi", $correo, $telefono, $id);
        $check -> execute();
        $check -> store_result();
        if($check -> num_rows > 0){
            http_response_code(409);
            echo json_encode(["error" => "duplicado", "mensaje" => "Ya existe otro paciente con ese correo o teléfono"]);
            $check -> close(); break;
        }; $check -> close();

        $stmt = $conn -> prepare("
            UPDATE paciente SET nombre=?, fecha_nac=?, telefono=?, correo=?,
            sexo=?, tipo_sangre=?, direccion=?, tel_emergencia=? WHERE id_paciente=?
        ");
        $stmt -> bind_param("ssssssssi",
            $nombre, $fecha_nac, $telefono, $correo,
            $sexo, $tipo_sangre, $direccion, $emergencia, $id
        );
        $stmt -> execute();

        $alergias = $datos['alergias'] ?? '';
        $med_act = $datos['med_act'] ?? '';
        $cir_prev  = $datos['cir_prev'] ?? '';
        $enfermedades = $datos['enfermedades'] ?? '';
        $habitos = implode(', ', $datos['habitos'] ?? []);

        $id_usuario = intval($datos['id_usuario'] ?? 1);

        $check = $conn -> prepare("SELECT id_antecedmed FROM antecmed WHERE id_paciente = ?");
        $check -> bind_param("i", $id);
        $check -> execute();
        $check -> store_result();

        if($check -> num_rows > 0){
            $stmt2 = $conn -> prepare("
                UPDATE antecmed SET alergias=?, med_act=?, cir_prev=?, enfermedades=?, habitos=?
                WHERE id_paciente=?
            ");
            $stmt2 -> bind_param("ssssi", $alergias, $med_act, $cir_prev, $enfermedades, $habitos, $id);
        } else{
            $stmt2 = $conn -> prepare("
                INSERT INTO antecmed (id_paciente, id_usuario, alergias, med_act, cir_prev, enfermedades, habitos)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt2 -> bind_param("iisssss", $id, $id_usuario, $alergias, $med_act, $cir_prev, $enfermedades, $habitos);
        } $check -> close(); $stmt2 -> execute();
        echo json_encode(["success" => true]); break;

    case 'eliminar_paciente':
        $datos = json_decode(file_get_contents("php://input"), true);
        $ids = $datos['ids'] ?? [];

        if(empty($ids)){ echo json_encode(["error" => "Sin IDs"]); break; }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $tipos = str_repeat('i', count($ids));

        $stmt = $conn -> prepare("DELETE FROM antecmed WHERE id_paciente IN ($placeholders)");
        $stmt -> bind_param($tipos, ...$ids);
        $stmt -> execute();

        $stmt2 = $conn -> prepare("DELETE FROM paciente WHERE id_paciente IN ($placeholders)");
        $stmt2 -> bind_param($tipos, ...$ids);
        $stmt2 -> execute();

        echo json_encode(["success" => true]);
        break;

    case 'subir_documento':
        $id_paciente = intval($_POST['id_paciente'] ?? 0);
        $id_usuario = intval($_POST['id_usuario'] ?? 1);

        if(!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== 0){
            echo json_encode(["error" => "No se recibió archivo"]); break;
        }

        $archivo = $_FILES['archivo'];
        $nombre_orig = basename($archivo['name']);
        $extension = strtolower(pathinfo($nombre_orig, PATHINFO_EXTENSION));
        $tipo_doc = $extension;

        $permitidos = ['pdf', 'jpg', 'jpeg', 'png'];
        if(!in_array($extension, $permitidos)){
            echo json_encode(["error" => "Tipo de archivo no permitido"]); break;
        }

        $nombre_archivo = "pac{$id_paciente}_" . time() . "_{$nombre_orig}";
        $ruta_relativa = "docs/{$nombre_archivo}";
        $ruta_absoluta = __DIR__ . "/docs/{$nombre_archivo}";

        if(!move_uploaded_file($archivo['tmp_name'], $ruta_absoluta)){
            echo json_encode(["error" => "Error al guardar el archivo"]); break;
        }

        $stmt = $conn -> prepare("
            INSERT INTO documentos (id_paciente, id_usuario, tipo_doc, nom_archivo, ruta_archivo, fecha_subida)
            VALUES (?, ?, ?, ?, ?, NOW())
        "); $stmt -> bind_param("iisss", $id_paciente, $id_usuario, $tipo_doc, $nombre_orig, $ruta_relativa);

        if($stmt -> execute()){
            echo json_encode(["success" => true, "ruta" => $ruta_relativa, "nombre" => $nombre_orig]);
        } else{ echo json_encode(["error" => "Error al guardar en BD: " . $stmt -> error]); }; break;

    case 'obtener_documentos':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn -> prepare("SELECT * FROM documentos WHERE id_paciente = ? ORDER BY fecha_subida DESC");
        $stmt -> bind_param("i", $id);
        $stmt -> execute();
        $result = $stmt -> get_result();
        $docs = [];
        while($row = $result -> fetch_assoc()) $docs[] = $row;
        echo json_encode($docs); break;

    case 'eliminar_documento':
        $datos = json_decode(file_get_contents("php://input"), true);
        $id_doc = intval($datos['id_doc'] ?? 0);

        $stmt = $conn -> prepare("SELECT ruta_archivo FROM documentos WHERE id_docs = ?");
        $stmt -> bind_param("i", $id_doc);
        $stmt -> execute();
        $result = $stmt -> get_result();
        $doc = $result -> fetch_assoc();

        if($doc){
            $ruta_absoluta = __DIR__ . "/" . $doc['ruta_archivo'];
            if(file_exists($ruta_absoluta)) unlink($ruta_absoluta);

            $stmt2 = $conn -> prepare("DELETE FROM documentos WHERE id_docs = ?");
            $stmt2 -> bind_param("i", $id_doc);
            $stmt2 -> execute();
            echo json_encode(["success" => true]);
        } else { echo json_encode(["error" => "Documento no encontrado"]); }; break;

    case 'obtener_citas':
        $result = $conn -> query("
            SELECT c.*, p.nombre as nombre_paciente 
            FROM citas c 
            JOIN paciente p ON c.id_paciente = p.id_paciente 
            ORDER BY c.fecha ASC, c.hora ASC
        ");
        $citas = [];
        while($row = $result -> fetch_assoc()) $citas[] = $row;
        echo json_encode($citas); break;

    case 'agregar_cita':
        $datos = json_decode(file_get_contents("php://input"), true);
        $id_paciente = intval($datos['id_paciente'] ?? 0);
        $id_usuario = intval($datos['id_usuario'] ?? 1);
        $fecha = $datos['fecha'] ?? '';
        $hora = $datos['hora'] ?? '';
        $servicio_cita = $datos['servicio_cita'] ?? '';
        $motivo_cita = $datos['motivo_cita'] ?? '';
        $nota = $datos['nota'] ?? '';
        $estado = 'Pendiente';

        $stmt = $conn -> prepare("
            INSERT INTO citas (id_paciente, id_usuario, fecha, hora, servicio, motivo_cita, nota, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt -> bind_param("iissssss",
            $id_paciente, $id_usuario, $fecha, $hora,
            $servicio_cita, $motivo_cita, $nota, $estado
        );
        if($stmt -> execute()){
            echo json_encode(["success" => true, "id_cita" => $conn -> insert_id]);
        } else{ echo json_encode(["error" => $stmt -> error]); } break;

    case 'eliminar_cita':
        $datos = json_decode(file_get_contents("php://input"), true);
        $id_cita = intval($datos['id_cita'] ?? 0);
        $stmt = $conn -> prepare("DELETE FROM citas WHERE id_cita = ?");
        $stmt -> bind_param("i", $id_cita);
        $stmt -> execute();
        echo json_encode(["success" => true, "service" => $servicio_cita]); break;

    case 'actualizar_estado_cita':
        $datos = json_decode(file_get_contents("php://input"), true);
        $id_cita = intval($datos['id_cita'] ?? 0);
        $estado  = $datos['estado'] ?? 'Pendiente';
        $stmt = $conn -> prepare("UPDATE citas SET estado=? WHERE id_cita=?");
        $stmt -> bind_param("si", $estado, $id_cita);
        $stmt -> execute();
        echo json_encode(["success" => true]); break;

    case 'guardar_consulta':
        $datos = json_decode(file_get_contents("php://input"), true);
        $id_paciente = intval($datos['id_paciente'] ?? 0);
        $id_usuario = intval($datos['id_usuario'] ?? 1);
        $diagnostico = $datos['diagnostico'] ?? '';
        $tratamiento = $datos['tratamiento'] ?? '';
        $observaciones = $datos['observaciones'] ?? '';

        $check = $conn -> prepare("SELECT id_consulta FROM consulta WHERE id_paciente = ?");
        $check -> bind_param("i", $id_paciente); $check -> execute(); $check -> store_result();

        if($check -> num_rows > 0){
            $stmt = $conn -> prepare("
                UPDATE consulta SET diagnostico=?, tratamiento=?, observaciones=?
                WHERE id_paciente=?
            "); $stmt -> bind_param("sssi", $diagnostico, $tratamiento, $observaciones, $id_paciente);
        } else{
            $stmt = $conn -> prepare("
                INSERT INTO consulta (id_paciente, id_usuario, diagnostico, tratamiento, observaciones)
                VALUES (?, ?, ?, ?, ?)
            "); $stmt -> bind_param("iisss", $id_paciente, $id_usuario, $diagnostico, $tratamiento, $observaciones);
        } $check -> close(); $stmt -> execute(); echo json_encode(["success" => true]); break;

    case 'obtener_consulta':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn -> prepare("SELECT * FROM consulta WHERE id_paciente = ? ORDER BY id_consulta DESC LIMIT 1");
        $stmt -> bind_param("i", $id);
        $stmt -> execute();
        $result = $stmt -> get_result();
        echo json_encode($result -> fetch_assoc() ?: null); break;

    case 'obtener_ultima_cita':
        $id = intval($_GET['id'] ?? 0);
        $stmt = $conn -> prepare("
            SELECT * FROM citas 
            WHERE id_paciente = ? 
            ORDER BY fecha DESC, hora DESC 
            LIMIT 1
        "); $stmt -> bind_param("i", $id); $stmt -> execute(); $result = $stmt -> get_result();
        echo json_encode($result -> fetch_assoc() ?: null); break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida"]); break;
}

$conn -> close();

?>