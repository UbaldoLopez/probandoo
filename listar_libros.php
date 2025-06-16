<?php
$directorio_base = 'biblioteca/';
$libros = [];

if (is_dir($directorio_base)) {
    $carpetas = scandir($directorio_base);
    
    foreach ($carpetas as $carpeta) {
        if ($carpeta === '.' || $carpeta === '..') continue;

        $ruta = $directorio_base . $carpeta . '/';
        if (is_dir($ruta)) {
            $archivos = scandir($ruta);
            $pdf = null;
            $cover = null;

            foreach ($archivos as $archivo) {
                if (preg_match('/\.pdf$/i', $archivo)) {
                    $pdf = $ruta . $archivo;
                }
                if (preg_match('/\.(png|jpg|jpeg)$/i', $archivo)) {
                    $cover = $ruta . $archivo;
                }
            }

            if ($pdf && $cover) {
                $libros[] = [
                    'nombre' => ucfirst(str_replace('_', ' ', $carpeta)),
                    'cover' => $cover,
                    'pdf' => $pdf
                ];
            }
        }
    }
}

header('Content-Type: application/json');
echo json_encode($libros);
