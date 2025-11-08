<?php
require 'db_connect.php';

http_response_code(200);
echo json_encode(['success' => true, 'data' => []]);

$conn->close();
?>