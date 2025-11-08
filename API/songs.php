<?php
require 'db_connect.php';

$songs = [];
$base_query = "SELECT s.song_id, s.title, s.genre, s.duration, s.audio_url, s.cover_image, 
                      a.artist_name, al.album_name 
               FROM songs s
               LEFT JOIN artists a ON s.artist_id = a.artist_id
               LEFT JOIN albums al ON s.album_id = al.album_id";

if (isset($_GET['search'])) {
    $search_query = $conn->real_escape_string($_GET['search']);
    $sql = $base_query . " WHERE s.title LIKE '%$search_query%' 
                         OR a.artist_name LIKE '%$search_query%' 
                         OR al.album_name LIKE '%$search_query%'";
}
else if (isset($_GET['genre'])) {
    $genre_query = $conn->real_escape_string($_GET['genre']);
    $sql = $base_query . " WHERE s.genre LIKE '%$genre_query%'";
}
else {
    $sql = $base_query;
}

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $songs]);
} else {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => []]);
}

$conn->close();
?>