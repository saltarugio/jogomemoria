<?php
// $username = "root";
// $password = "root";
// $database = "letreco";
// $hostname = "127.0.0.1";

$username = "newuser";
$password = "root";
$database = "letreco";
$hostname = "10.0.80.139";
$conn = new mysqli($hostname, $username, $password, $database);
if($conn->connect_errno){
    die("Conexão falhou: (". $conn->connect_errno . ")" . $conn->connect_error); 
}
?>
