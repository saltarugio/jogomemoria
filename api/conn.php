<?php
$username = "root";
$password = "root";
$database = "letreco";
<<<<<<< HEAD
$hostname = "127.0.0.1";
=======
$hostname = "127.0.0.1"
>>>>>>> ad5b1d3d1e4baab985ded2948bfa3a0396808caf

$conn = new mysqli($hostname, $username, $password, $database);
if($conn->connect_errno){
    die("Conexão falhou: (". $conn->connect_errno . ")" . $conn->connect_error); 
}
?>