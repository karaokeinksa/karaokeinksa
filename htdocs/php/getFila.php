<?php
// getFila.php
header('Content-Type: application/json');

$filaFile = '../data/fila.json';

try {
    if (!file_exists($filaFile)) {
        echo json_encode([]);
        exit;
    }

    $fila = json_decode(file_get_contents($filaFile), true);
    
    if ($fila === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Erro ao ler arquivo da fila');
    }

    echo json_encode($fila);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro ao carregar fila: ' . $e->getMessage()
    ]);
}
?>
