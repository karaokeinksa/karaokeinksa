<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $index = $data['index'];
    $direction = $data['direction'];
    
    // Read current queue
    $queue = json_decode(file_get_contents('../data/fila.json'), true);
    
    if ($direction === 'up' && $index > 0) {
        // Swap with previous item
        $temp = $queue[$index - 1];
        $queue[$index - 1] = $queue[$index];
        $queue[$index] = $temp;
    } else if ($direction === 'down' && $index < count($queue) - 1) {
        // Swap with next item
        $temp = $queue[$index + 1];
        $queue[$index + 1] = $queue[$index];
        $queue[$index] = $temp;
    }
    
    // Save updated queue
    file_put_contents('../data/fila.json', json_encode($queue, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}