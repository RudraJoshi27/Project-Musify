// Musify - Frontend JavaScript with PHP API Integration (Enhanced Version)
// Includes: Search + Genre Filtering + Instant Sync

// =======================
// API Configuration
// =======================
const API_BASE_URL = 'http://localhost/PROJECT_MUSIFY/API/';
const API_ENDPOINTS = {
    songs: API_BASE_URL + 'songs.php',
    likedSongs: API_BASE_URL + 'liked_songs.php',
    artists: API_BASE_URL + 'artists.php',
    playlists: API_BASE_URL + 'playlists.php'
};

// =======================
// Global Variables
// =======================
let musicData = [];
let currentSong = null;
let isPlaying = false;
let likedSongs = [];
let currentPlaylist = [];
let currentSongIndex = 0;
let audioPlayer = new Audio();

// =======================
// DOM Elements
// =======================
const playBtn = document.querySelector(".play-btn");
const heartBtns = document.querySelectorAll(".heart-btn");
const likeButtons = document.querySelectorAll(".like-btn");

// =======================
// Initialize App
// =======================
document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});

async function initializeApp() {
    await loadMusicFromAPI();
    await loadLikedSongsFromAPI();

    if (musicData.length > 0) {
        loadSong(musicData[0]);
    }

    setupEventListeners();
    setupAudioPlayer();

    if (window.location.pathname.includes("library.html")) {
        loadLibraryPage();
    }

    if (window.location.pathname.includes("browse.html")) {
        loadBrowsePage();
    }

    updateLikeButtonsUI();
}

// =======================
// API Functions
// =======================
async function loadMusicFromAPI() {
    try {
        const response = await fetch(API_ENDPOINTS.songs);
        const result = await response.json();
        const data = result.data || result;

        if (Array.isArray(data)) {
            musicData = data.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist_name,
                album: song.album_name,
                duration: song.duration,
                image: song.cover_image,
                audio_url: song.audio_url,
                genre: song.genre
            }));
            currentPlaylist = musicData;
        }
    } catch (error) {
        console.error('Error loading music:', error);
    }
}

async function loadLikedSongsFromAPI() {
    try {
        const response = await fetch(API_ENDPOINTS.likedSongs);
        const result = await response.json();
        const data = result.data || result;

        if (Array.isArray(data)) {
            likedSongs = data.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist_name,
                album: song.album_name,
                duration: song.duration,
                image: song.cover_image,
                audio_url: song.audio_url,
                genre: song.genre
            }));
        }

        // ✅ Instant refresh for Library UI (if open)
        updateLikeButtonsUI();
        updateHeartButtonState();
        updateLibraryUI();
    } catch (error) {
        console.error('Error loading liked songs:', error);
    }
}

async function toggleLikeSongAPI(songId) {
    try {
        const response = await fetch(API_ENDPOINTS.likedSongs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ song_id: songId })
        });

        const result = await response.json();
        if (result.success) {
            await loadLikedSongsFromAPI(); // ✅ reloads liked list & updates library live
            return result.liked;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// =======================
// Audio Player Setup
// =======================
function setupAudioPlayer() {
    audioPlayer.addEventListener('ended', playNextSong);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
}

// =======================
// Event Listeners
// =======================
function setupEventListeners() {
    if (playBtn) playBtn.addEventListener("click", togglePlayPause);

    const prevBtn = document.querySelector(".fa-step-backward")?.parentElement;
    const nextBtn = document.querySelector(".fa-step-forward")?.parentElement;
    if (prevBtn) prevBtn.addEventListener("click", playPreviousSong);
    if (nextBtn) nextBtn.addEventListener("click", playNextSong);

    // Heart in player
    heartBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            if (currentSong) await toggleLikeSong(currentSong.id);
        });
    });

    // Like buttons in charts
    likeButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.dataset.songId) || 1;
            await toggleLikeSong(songId);
        });
    });

    // Progress bar seek
    const progressBar = document.querySelector(".progress");
    if (progressBar) {
        progressBar.addEventListener("click", (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = audioPlayer.duration * percent;
        });
    }

    // Volume control
    const volumeBar = document.querySelector(".volume-bar");
    if (volumeBar) {
        volumeBar.addEventListener("click", (e) => {
            const rect = volumeBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.volume = percent;
            const volumeFill = volumeBar.querySelector(".volume-fill");
            if (volumeFill) volumeFill.style.width = `${percent * 100}%`;
        });
    }

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT") return;
        switch (e.code) {
            case "Space":
                e.preventDefault(); togglePlayPause(); break;
            case "ArrowLeft":
                e.preventDefault(); playPreviousSong(); break;
            case "ArrowRight":
                e.preventDefault(); playNextSong(); break;
        }
    });

    // Search events
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.querySelector(".search-btn");
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch();
        });
    }
    if (searchBtn) searchBtn.addEventListener("click", handleSearch);

    // Genre cards
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach((card) => {
        card.addEventListener("click", () => {
            const genre = card.querySelector("h3").textContent.toLowerCase();
            filterByGenre(genre);
        });
    });
}

// =======================
// Player Logic
// =======================
function loadSong(song) {
    if (!song) return;
    currentSong = song;
    currentSongIndex = currentPlaylist.findIndex(s => s.id === song.id);

    audioPlayer.src = song.audio_url.startsWith('http')
        ? song.audio_url
        : 'http://localhost/PROJECT_MUSIFY/' + song.audio_url;

    document.getElementById("current-track-image").src = song.image || "default.jpg";
    document.getElementById("current-track-title").textContent = song.title;
    document.getElementById("current-track-artist").textContent = song.artist;

    updateHeartButtonState();
    updateDuration();
}

function togglePlayPause() {
    if (!currentSong || !audioPlayer.src) return;
    isPlaying = !isPlaying;
    const playIcon = playBtn.querySelector("i");

    if (isPlaying) {
        audioPlayer.play();
        playIcon.className = "fas fa-pause";
    } else {
        audioPlayer.pause();
        playIcon.className = "fas fa-play";
    }
}

function playPreviousSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        loadSong(currentPlaylist[currentSongIndex]);
        if (isPlaying) audioPlayer.play();
    }
}

function playNextSong() {
    if (currentPlaylist.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    loadSong(currentPlaylist[currentSongIndex]);
    if (isPlaying) audioPlayer.play();
}

// =======================
// Like System
// =======================
async function toggleLikeSong(songId) {
    const liked = await toggleLikeSongAPI(songId);
    updateLikeButtonsUI();
    updateHeartButtonState();
    updateLibraryUI(); // ✅ Instant live library update
}

function updateLikeButtonsUI() {
    likeButtons.forEach(btn => {
        const songId = parseInt(btn.dataset.songId);
        const isLiked = likedSongs.some(s => s.id === songId);
        btn.style.color = isLiked ? "#1db954" : "#b3b3b3";
    });
}

function updateHeartButtonState() {
    if (!currentSong) return;
    const isLiked = likedSongs.some(s => s.id === currentSong.id);
    heartBtns.forEach(btn => {
        btn.style.color = isLiked ? "#1db954" : "#b3b3b3";
    });
}

// =======================
// Library Page Sync
// =======================
function updateLibraryUI() {
    if (window.location.pathname.includes("library.html")) {
        const libraryStats = document.getElementById("library-stats");
        const librarySongsList = document.getElementById("library-songs-list");
        const emptyLibrary = document.getElementById("empty-library");

        if (libraryStats) libraryStats.textContent = `${likedSongs.length} songs`;

        if (likedSongs.length === 0) {
            librarySongsList.style.display = "none";
            emptyLibrary.style.display = "block";
        } else {
            emptyLibrary.style.display = "none";
            librarySongsList.style.display = "block";
            renderLibrarySongs();
        }
    }
}

// --- Play all liked songs when green play button is clicked ---
document.addEventListener("DOMContentLoaded", () => {
    const playLikedBtn = document.getElementById("play-liked-btn");
    if (playLikedBtn) {
        playLikedBtn.addEventListener("click", playAllLikedSongs);
    }
});

// --- Function: Play All Liked Songs ---
function playAllLikedSongs() {
    if (likedSongs.length === 0) return;
    currentPlaylist = likedSongs;
    loadSong(likedSongs[0]);
    isPlaying = true;
    audioPlayer.play();

    const playIcon = playBtn.querySelector("i");
    if (playIcon) playIcon.className = "fas fa-pause";
}

// --- Function: Play Individual Liked Song ---
function playLikedSong(songId) {
    const selectedSong = likedSongs.find(s => s.id == songId);
    if (!selectedSong) return;

    currentPlaylist = likedSongs;
    loadSong(selectedSong);
    isPlaying = true;
    audioPlayer.play();

    const playIcon = playBtn.querySelector("i");
    if (playIcon) playIcon.className = "fas fa-pause";
}


function renderLibrarySongs() {
    const container = document.getElementById("library-songs-list");
    if (!container) return;

    container.innerHTML = likedSongs
        .map((song, index) => `
        <div class="song-row" onclick="playLikedSong(${song.id})">
            <div class="song-number">${index + 1}</div>
            <div class="song-title-info">
                <img src="${song.image}" alt="${song.title}" class="song-cover">
                <div class="song-details">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            </div>
            <div class="song-artist">${song.artist}</div>
            <div class="song-album">${song.album}</div>
            <div class="song-duration">${song.duration}</div>
        </div>`).join("");
}


// =======================
// Player UI
// =======================
function updateProgressBar() {
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill && audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + "%";
    }
}

function updateDuration() {
    const durationEl = document.querySelector(".progress-bar .time:last-child");
    if (durationEl && audioPlayer.duration) {
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// =======================
// Browse Page (Search / Genre)
// =======================
function loadBrowsePage() {
    const searchResults = document.getElementById("search-results");
    if (searchResults) searchResults.style.display = "none";
}

// --- Search Function (with Click-to-Play) ---
async function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const resultsContainer = document.getElementById("results-container");
    if (!searchInput || !searchResults || !resultsContainer) return;

    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
        searchResults.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.songs}?search=${encodeURIComponent(query)}`);
        const result = await response.json();
        const data = result.data || result;

        searchResults.style.display = "block";
        searchResults.querySelector("h2").textContent = `Search Results`;

        if (Array.isArray(data) && data.length > 0) {
            // ✅ Render clickable search cards
            resultsContainer.innerHTML = data.map(song => `
                <div class="playlist-card" onclick="playSearchedSong(${song.song_id})">
                    <img src="${song.cover_image}" alt="${song.title}">
                    <h3>${song.title}</h3>
                    <p>${song.artist_name}</p>
                </div>
            `).join("");

            // ✅ Store current search results as temporary playlist
            currentPlaylist = data.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist_name,
                album: song.album_name,
                duration: song.duration,
                image: song.cover_image,
                audio_url: song.audio_url,
                genre: song.genre
            }));
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No results found for "${query}"</h3>
                    <p>Try searching for another song or artist.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

// --- Play song directly from search results ---
function playSearchedSong(songId) {
    const selectedSong = currentPlaylist.find(s => s.id == songId);
    if (!selectedSong) return;
    loadSong(selectedSong);
    isPlaying = true;
    audioPlayer.play();

    const playIcon = playBtn.querySelector("i");
    if (playIcon) playIcon.className = "fas fa-pause";
}


// --- Genre Filter Function (with Auto-Play) ---
async function filterByGenre(genre) {
    const searchResults = document.getElementById("search-results");
    const resultsContainer = document.getElementById("results-container");
    if (!searchResults || !resultsContainer) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.songs}?genre=${encodeURIComponent(genre)}`);
        const result = await response.json();
        const data = result.data || result;

        searchResults.style.display = "block";
        const title = genre.charAt(0).toUpperCase() + genre.slice(1);
        searchResults.querySelector("h2").textContent = `${title} Songs`;

        if (Array.isArray(data) && data.length > 0) {
            // ✅ Display the songs
            resultsContainer.innerHTML = data.map(song => `
                <div class="playlist-card" onclick="playSongByGenre(${song.song_id}, '${genre}')">
                    <img src="${song.cover_image}" alt="${song.title}">
                    <h3>${song.title}</h3>
                    <p>${song.artist_name}</p>
                </div>
            `).join("");

            // ✅ Set playlist & auto-play first song
            currentPlaylist = data.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist_name,
                album: song.album_name,
                duration: song.duration,
                image: song.cover_image,
                audio_url: song.audio_url,
                genre: song.genre
            }));

            loadSong(currentPlaylist[0]);
            isPlaying = true;
            audioPlayer.play();
            const playIcon = playBtn.querySelector("i");
            if (playIcon) playIcon.className = "fas fa-pause";
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No ${genre} songs found</h3>
                    <p>Try exploring another category.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Genre filter error:", error);
    }
}

// --- Play specific song inside a genre ---
function playSongByGenre(songId, genre) {
    const selectedSong = currentPlaylist.find(s => s.id == songId);
    if (!selectedSong) return;
    loadSong(selectedSong);
    isPlaying = true;
    audioPlayer.play();
    const playIcon = playBtn.querySelector("i");
    if (playIcon) playIcon.className = "fas fa-pause";
}

// =======================
// Auto Assign Song IDs for Chart Buttons
// =======================
document.addEventListener("DOMContentLoaded", function () {
    const chartLikeButtons = document.querySelectorAll(".chart-item .like-btn");
    chartLikeButtons.forEach((btn, index) => {
        btn.dataset.songId = index + 1;
    });
});
