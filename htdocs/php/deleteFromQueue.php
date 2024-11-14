<?php
// deleteFromQueue.php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $index = $data['index'];
    
    // Read current queue
    $queue = json_decode(file_get_contents('../data/fila.json'), true);
    
    // Remove item at index
    array_splice($queue, $index, 1);
    
    // Save updated queue
    file_put_contents('../data/fila.json', json_encode($queue, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}