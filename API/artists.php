<?php
require 'db_connect.php';

$artists = [];
$sql = "SELECT * FROM artists";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $artists[] = $row;
    }
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $artists]);
} else {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => []]);
}

$conn->close();
?>