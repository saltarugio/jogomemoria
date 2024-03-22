<?php
// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$database = "letreco";

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}