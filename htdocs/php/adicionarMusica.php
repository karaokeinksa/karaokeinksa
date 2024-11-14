<?php
// adicionarMusica.php
header('Content-Type: application/json');

// Configurações de erro
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Caminho para o arquivo da fila
$filaFile = '../data/fila.json';

// Receber e decodificar os dados JSON
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

// Verificar se os dados são válidos
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'Dados JSON inválidos: ' . json_last_error_msg()
    ]);
    exit;
}

// Verificar se todos os campos necessários estão presentes
if (!isset($data['title']) || !isset($data['artist']) || !isset($data['cantor'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Dados incompletos'
    ]);
    exit;
}

try {
    // Carregar fila existente ou criar nova
    if (file_exists($filaFile)) {
        $fila = json_decode(file_get_contents($filaFile), true);
        if ($fila === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Erro ao ler arquivo da fila');
        }
    } else {
        $fila = [];
    }

    // Adicionar nova música à fila
    $fila[] = [
        'title' => $data['title'],
        'artist' => $data['artist'],
        'cantor' => $data['cantor']
    ];

    // Salvar fila atualizada
    if (file_put_contents($filaFile, json_encode($fila, JSON_PRETTY_PRINT)) === false) {
        throw new Exception('Erro ao salvar arquivo da fila');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Música adicionada com sucesso'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao processar requisição: ' . $e->getMessage()
    ]);
}
?>