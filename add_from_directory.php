<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $ruta = 'libros/' . $nombre;

    $pdfPath = $ruta . '.pdf';
    $imgPath = $ruta . '.png';

    // Puedes aceptar también .jpg
    if (!file_exists($imgPath)) {
        $imgPath = $ruta . '.jpg';
    }

    if (file_exists($pdfPath) && file_exists($imgPath)) {
        $data = [
            'nombre' => $nombre,
            'pdf' => $pdfPath,
            'cover' => $imgPath,
            'descripcion' => '' // Podrías luego permitir editarla
        ];

        // Guardar en archivo JSON (simula base de datos)
        $jsonFile = 'libros.json';
        $libros = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];
        $libros[] = $data;
        file_put_contents($jsonFile, json_encode($libros, JSON_PRETTY_PRINT));

        echo json_encode(['status' => 'ok', 'message' => 'Libro añadido']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Archivos no encontrados']);
    }
}
