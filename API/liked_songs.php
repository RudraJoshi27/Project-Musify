<?php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT s.song_id, s.title, s.genre, s.duration, s.audio_url, s.cover_image,
                       a.artist_name, al.album_name
                FROM liked_songs ls
                JOIN songs s ON ls.song_id = s.song_id
                LEFT JOIN artists a ON s.artist_id = a.artist_id
                LEFT JOIN albums al ON s.album_id = al.album_id";
        
        $result = $conn->query($sql);
        $liked_songs = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $liked_songs[] = $row;
            }
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $liked_songs]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->song_id)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Song ID not provided.']);
            exit();
        }
        
        $song_id = (int)$data->song_id;
        
        $check_sql = "SELECT * FROM liked_songs WHERE song_id = ?";
        $stmt = $conn->prepare($check_sql);
        $stmt->bind_param("i", $song_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $delete_sql = "DELETE FROM liked_songs WHERE song_id = ?";
            $stmt = $conn->prepare($delete_sql);
            $stmt->bind_param("i", $song_id);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['success' => true, 'liked' => false, 'message' => 'Song unliked.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to unlike song.']);
            }
        } else {
            $insert_sql = "INSERT INTO liked_songs (song_id) VALUES (?)";
            $stmt = $conn->prepare($insert_sql);
            $stmt->bind_param("i", $song_id);
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'liked' => true, 'message' => 'Song liked.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to like song.']);
            }
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
        break;
}

$conn->close();
?>