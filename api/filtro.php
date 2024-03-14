<?php

function removerAcentuacao($string) {
    // Remove a acentuação da string usando expressões regulares
    $string = preg_replace('/[^\p{L}\p{N}]+/u', '', $string);
    // Converte a string para maiúsculas
    $string = mb_strtoupper($string);
    return $string;
}

function filtrarPalavrasPorTamanho($caminhoArquivoEntrada, $caminhoDiretorioSaida) {
    // Verifica se o diretório de saída existe, se não, cria
    if (!file_exists($caminhoDiretorioSaida)) {
        mkdir($caminhoDiretorioSaida, 0777, true);
    }
    
    // Abre o arquivo de entrada para leitura
    $arquivoEntrada = fopen($caminhoArquivoEntrada, 'r');
    if (!$arquivoEntrada) {
        die("Não foi possível abrir o arquivo de entrada.");
    }

    // Loop através das palavras no arquivo de entrada
    while (!feof($arquivoEntrada)) {
        $palavra = trim(fgets($arquivoEntrada)); // Lê uma linha do arquivo e remove espaços em branco

        // Verifica se a palavra não está vazia
        if (!empty($palavra)) {
            $palavra = strtoupper(removerAcentuacao($palavra)); // Converte a palavra para maiúsculas e remove a acentuação
            $tamanhoPalavra = strlen($palavra);
            $arquivoSaida = fopen($caminhoDiretorioSaida . "/palavras_$tamanhoPalavra.txt", 'a'); // Abre ou cria o arquivo de saída
            
            // Escreve a palavra no arquivo de saída correspondente ao seu tamanho
            fwrite($arquivoSaida, $palavra . "\n");

            // Fecha o arquivo de saída
            fclose($arquivoSaida);
        }
    }

    // Fecha o arquivo de entrada
    fclose($arquivoEntrada);
}

// Exemplo de uso da função
$caminhoArquivoEntrada = 'C:\xampp\htdocs\hunterword/brsemacentos.txt';
$caminhoDiretorioSaida = 'C:\xampp\htdocs\hunterword/filters/';

filtrarPalavrasPorTamanho($caminhoArquivoEntrada, $caminhoDiretorioSaida);

echo "As palavras foram filtradas e salvas nos arquivos de saída correspondentes ao seu tamanho.";
?>
