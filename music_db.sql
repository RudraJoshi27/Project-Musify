-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 09, 2025 at 08:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `music_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `album_id` int(11) NOT NULL,
  `album_name` varchar(255) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `release_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`album_id`, `album_name`, `artist_id`, `release_year`) VALUES
(1, 'After Hours', 1, 2020),
(2, '÷ (Divide)', 2, 2017),
(3, 'Harry\'s House', 3, 2022),
(4, 'Fine Line', 3, 2019),
(5, 'A Night at the Opera', 4, 1975),
(6, 'Led Zeppelin IV', 5, 1971),
(7, 'Hotel California', 6, 1976),
(8, 'Time Out', 7, 1959),
(9, 'Kind of Blue', 8, 1959),
(10, 'Für Elise (Single)', 9, 1810),
(11, 'Suite bergamasque', 10, 1905),
(12, '4x4=12', 11, 2010),
(13, 'Scary Monsters and Nice Sprites', 12, 2010),
(14, 'The Eminem Show', 13, 2002),
(15, 'DAMN.', 14, 2017);

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `artist_id` int(11) NOT NULL,
  `artist_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`artist_id`, `artist_name`) VALUES
(1, 'The Weeknd'),
(2, 'Ed Sheeran'),
(3, 'Harry Styles'),
(4, 'Queen'),
(5, 'Led Zeppelin'),
(6, 'Eagles'),
(7, 'Dave Brubeck'),
(8, 'Miles Davis'),
(9, 'Ludwig van Beethoven'),
(10, 'Claude Debussy'),
(11, 'deadmau5'),
(12, 'Skrillex'),
(13, 'Eminem'),
(14, 'Kendrick Lamar');

-- --------------------------------------------------------

--
-- Table structure for table `liked_songs`
--

CREATE TABLE `liked_songs` (
  `like_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `liked_songs`
--

INSERT INTO `liked_songs` (`like_id`, `song_id`) VALUES
(7, 3),
(10, 4),
(11, 9),
(13, 15);

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `song_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `duration` varchar(8) DEFAULT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`song_id`, `title`, `artist_id`, `album_id`, `genre`, `duration`, `audio_url`, `cover_image`) VALUES
(1, 'Blinding Lights', 1, 1, 'Pop', '3:25', 'audio/Blinding Lights.mp3', 'https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36'),
(2, 'Shape of You', 2, 2, 'Pop', '3:52', 'audio/shape_of_you.mp3', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png'),
(3, 'Watermelon Sugar', 3, 3, 'Pop', '2:54', 'audio/Watermelon Sugar.mp3', 'https://i.scdn.co/image/ab67616d0000b273cb36f982f17f319a541de1c4'),
(4, 'As It Was', 3, 4, 'Pop', '2:47', 'audio/As It Was.mp3', 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14'),
(5, 'Bohemian Rhapsody', 4, 5, 'Rock', '5:55', 'audio/Bohemian Rhapsody.mp3', 'https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b'),
(6, 'Stairway To Heaven', 5, 6, 'Rock', '8:02', 'audio/Stairway To Heaven.mp3', 'https://i.scdn.co/image/ab67616d00001e0217f83fbf2b04530c2cc85eab'),
(7, 'Hotel California', 6, 7, 'Rock', '6:30', 'audio/Hotel California.mp3', 'https://i.scdn.co/image/ab67616d0000b27301695cb519c93bd47b31299b'),
(8, 'Take Five', 7, 8, 'Jazz', '5:24', 'audio/Take Five.mp3', 'https://e.snmc.io/i/1200/s/2f4c1ace246688a7c6d32e9b43462805/1520950'),
(9, 'Blue In Green', 8, 9, 'Jazz', '5:37', 'audio/Blue In Green.mp3', 'https://i.scdn.co/image/ab67616d0000b2734fbfbd8762e7b7af4d42c00b'),
(10, 'Fur Elise', 9, 10, 'Classical', '2:50', 'audio/Fur Elise.mp3', 'https://i.scdn.co/image/ab67616d0000b273271004778e0a762c4df2a5a5'),
(11, 'Clair de Lune', 10, 11, 'Classical', '5:05', 'audio/Clair De Lune.mp3', 'https://i.scdn.co/image/ab67616d0000b273f2c7155f97edfbc3c1d1af6d'),
(12, 'Strobe', 11, 12, 'Electronic', '10:37', 'audio/deadmau5 - Strobe.mp3', 'https://i.scdn.co/image/ab67616d00001e02ae441d94b99dc2dad3bcf6ab'),
(13, 'Scary Monsters and Nice Sprites', 12, 13, 'Electronic', '4:03', 'audio/Skrillex - Scary Monsters And Nice Sprites (Official Audio).mp3', 'https://i.scdn.co/image/ab67616d0000b2736bcc25d1e144824c4c786f43'),
(14, 'Lose Yourself', 13, 14, 'Hip Hop', '5:26', 'audio/Eminem - Lose Yourself (Official Video) (Explicit).mp3', 'https://i.scdn.co/image/ab67616d0000b273968da85f248a7e7747767801'),
(15, 'HUMBLE.', 14, 15, 'Hip Hop', '2:57', 'audio/Kendrick Lamar - HUMBLE. [Lyrics].mp3', 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`album_id`),
  ADD KEY `artist_id` (`artist_id`);

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`artist_id`);

--
-- Indexes for table `liked_songs`
--
ALTER TABLE `liked_songs`
  ADD PRIMARY KEY (`like_id`),
  ADD UNIQUE KEY `unique_song` (`song_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`song_id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `album_id` (`album_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `artist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `liked_songs`
--
ALTER TABLE `liked_songs`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `song_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`) ON DELETE SET NULL;

--
-- Constraints for table `liked_songs`
--
ALTER TABLE `liked_songs`
  ADD CONSTRAINT `liked_songs_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`song_id`) ON DELETE CASCADE;

--
-- Constraints for table `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `albums` (`album_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
