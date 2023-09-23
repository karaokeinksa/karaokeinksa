<?php

$nome = $_POST['nome'];
$musica = $_POST['musica'];

$arquivo = fopen('musicas.txt', 'a'); // Abre o arquivo em modo de escrita (append)

if ($arquivo) {
    fwrite($arquivo, $musica . '  ' . $nome . "\n"); // Escreve a música no arquivo
    fclose($arquivo); // Fecha o arquivo
    echo 'Música adicionada na PlayList, aguarde sua vez!!';
} else {
    echo 'Erro ao abrir o arquivo para escrita.';
}

?>