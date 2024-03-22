<?php
include('./conn.php');
header('Content-Type: application/javascript');


// Consulta SQL para buscar os dados
$sql = "SELECT * FROM palavra";
$result = $conn->query($sql);

// Array para armazenar os novos dados
$new_data = array();

if ($result->num_rows > 0) {
    // Itera sobre os resultados e armazena-os no array
    while($row = $result->fetch_assoc()) {
        // Converte as palavras para maiúsculas
        $row['palavra'] = strtoupper($row['palavra']);
        $new_data[] = $row;
    }
} else {
    echo "0 resultados";
}

// Caminho para o arquivo JS
$JS_file = 'C://xampp/htdocs/hunterwordjson/words/words.js';

// Abre o arquivo JS para escrita
$file_handle = fopen($JS_file, 'w');

if ($file_handle) {
    // Escreve a declaração inicial do array no arquivo JS
    fwrite($file_handle, "let words = [\n");

    // Escreve as palavras como objetos no arquivo JS
    foreach ($new_data as $word) {
        $word_json = json_encode($word, JSON_UNESCAPED_UNICODE); // Garante que caracteres especiais sejam tratados corretamente
        fwrite($file_handle, "\t$word_json,\n");
    }

    // Escreve o fim do array no arquivo JS
    fwrite($file_handle, "];\n");

    
}
// Fecha a conexão com o banco de dados
$conn->close();
?>