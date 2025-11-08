// Musify - Frontend JavaScript

// Sample music data
const musicData = [
   {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:22",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 3,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 4,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      album: "F*CK LOVE 3",
      duration: "2:21",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 5,
      title: "Industry Baby",
      artist: "Lil Nas X, Jack Harlow",
      album: "MONTERO",
      duration: "3:32",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
      genre: "hip-hop",
   },
   {
      id: 6,
      title: "Bad Habits",
      artist: "Ed Sheeran",
      album: "=",
      duration: "3:50",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 7,
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      duration: "3:58",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
      genre: "indie",
   },
   {
      id: 8,
      title: "Shivers",
      artist: "Ed Sheeran",
      album: "=",
      duration: "3:27",
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 9,
      title: "Easy On Me",
      artist: "Adele",
      album: "30",
      duration: "3:44",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      genre: "pop",
   },
   {
      id: 10,
      title: "Ghost",
      artist: "Justin Bieber",
      album: "Justice",
      duration: "2:33",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
      genre: "pop",
   },
];

// Global variables
let currentSong = null;
let isPlaying = false;
let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let currentPlaylist = musicData;
let currentSongIndex = 0;

// DOM Elements
const playBtn = document.querySelector(".play-btn");
const heartBtns = document.querySelectorAll(".heart-btn");
const likeButtons = document.querySelectorAll(".like-btn");

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
   initializeApp();
});

function initializeApp() {
   // Initialize music player
   if (musicData.length > 0) {
      loadSong(musicData[0]);
   }

   // Add event listeners
   setupEventListeners();

   // Load library page if we're on it
   if (window.location.pathname.includes("library.html")) {
      loadLibraryPage();
   }

   // Load browse page if we're on it
   if (window.location.pathname.includes("browse.html")) {
      loadBrowsePage();
   }

   // Update UI based on liked songs
   updateLikeButtonsUI();
}

function setupEventListeners() {
   // Music player controls
   if (playBtn) {
      playBtn.addEventListener("click", togglePlayPause);
   }

   // Previous/Next buttons
   const prevBtn = document.querySelector(".fa-step-backward").parentElement;
   const nextBtn = document.querySelector(".fa-step-forward").parentElement;

   if (prevBtn) {
      prevBtn.addEventListener("click", playPreviousSong);
   }

   if (nextBtn) {
      nextBtn.addEventListener("click", playNextSong);
   }

   // Heart buttons in player
   heartBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
         if (currentSong) {
            toggleLikeSong(currentSong.id);
         }
      });
   });

   // Like buttons in charts
   likeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         e.stopPropagation();
         const songId = parseInt(btn.dataset.songId) || 1; // Default to first song
         toggleLikeSong(songId);
      });
   });

   // Chart items click to play
   const chartItems = document.querySelectorAll(".chart-item");
   chartItems.forEach((item, index) => {
      item.addEventListener("click", () => {
         playSongByIndex(index);
      });
   });

   // Search functionality
   const searchInput = document.getElementById("search-input");
   const searchBtn = document.querySelector(".search-btn");

   if (searchInput) {
      searchInput.addEventListener("input", handleSearch);
      searchInput.addEventListener("keypress", (e) => {
         if (e.key === "Enter") {
            handleSearch();
         }
      });
   }

   if (searchBtn) {
      searchBtn.addEventListener("click", handleSearch);
   }

   // Category cards
   const categoryCards = document.querySelectorAll(".category-card");
   categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
         const genre = card.querySelector("h3").textContent.toLowerCase();
         filterByGenre(genre);
      });
   });

   // Library controls
   const playAllBtn = document.querySelector(".play-all-btn");
   if (playAllBtn) {
      playAllBtn.addEventListener("click", playAllLikedSongs);
   }
}

function loadSong(song) {
   currentSong = song;
   currentSongIndex = musicData.findIndex((s) => s.id === song.id);

   // Update player UI
   const currentTrackImage = document.getElementById("current-track-image");
   const currentTrackTitle = document.getElementById("current-track-title");
   const currentTrackArtist = document.getElementById("current-track-artist");

   if (currentTrackImage) currentTrackImage.src = song.image;
   if (currentTrackTitle) currentTrackTitle.textContent = song.title;
   if (currentTrackArtist) currentTrackArtist.textContent = song.artist;

   // Update heart button state
   updateHeartButtonState();
}

function togglePlayPause() {
   isPlaying = !isPlaying;

   const playIcon = playBtn.querySelector("i");
   if (isPlaying) {
      playIcon.className = "fas fa-pause";
      // In a real app, you would start audio playback here
   } else {
      playIcon.className = "fas fa-play";
      // In a real app, you would pause audio playback here
   }
}

function playPreviousSong() {
   if (currentSongIndex > 0) {
      currentSongIndex--;
      loadSong(currentPlaylist[currentSongIndex]);
      if (isPlaying) {
         // Auto-play the previous song
         setTimeout(() => {
            const playIcon = playBtn.querySelector("i");
            playIcon.className = "fas fa-pause";
         }, 100);
      }
   }
}

function playNextSong() {
   if (currentSongIndex < currentPlaylist.length - 1) {
      currentSongIndex++;
      loadSong(currentPlaylist[currentSongIndex]);
      if (isPlaying) {
         // Auto-play the next song
         setTimeout(() => {
            const playIcon = playBtn.querySelector("i");
            playIcon.className = "fas fa-pause";
         }, 100);
      }
   }
}

function playSongByIndex(index) {
   if (index >= 0 && index < musicData.length) {
      loadSong(musicData[index]);
      isPlaying = true;
      const playIcon = playBtn.querySelector("i");
      playIcon.className = "fas fa-pause";
   }
}

function toggleLikeSong(songId) {
   const song = musicData.find((s) => s.id === songId);
   if (!song) return;

   const existingIndex = likedSongs.findIndex((s) => s.id === songId);

   if (existingIndex > -1) {
      // Remove from liked songs
      likedSongs.splice(existingIndex, 1);
   } else {
      // Add to liked songs
      likedSongs.push(song);
   }

   // Save to localStorage
   localStorage.setItem("likedSongs", JSON.stringify(likedSongs));

   // Update UI
   updateLikeButtonsUI();
   updateHeartButtonState();

   // If we're on the library page, reload it
   if (window.location.pathname.includes("library.html")) {
      loadLibraryPage();
   }
}

function updateLikeButtonsUI() {
   likeButtons.forEach((btn) => {
      const songId = parseInt(btn.dataset.songId) || 1;
      const isLiked = likedSongs.some((s) => s.id === songId);

      if (isLiked) {
         btn.style.color = "#1db954";
      } else {
         btn.style.color = "#b3b3b3";
      }
   });
}

function updateHeartButtonState() {
   if (!currentSong) return;

   const isLiked = likedSongs.some((s) => s.id === currentSong.id);

   heartBtns.forEach((btn) => {
      if (isLiked) {
         btn.style.color = "#1db954";
      } else {
         btn.style.color = "#b3b3b3";
      }
   });
}

function loadLibraryPage() {
   const libraryStats = document.getElementById("library-stats");
   const librarySongsList = document.getElementById("library-songs-list");
   const emptyLibrary = document.getElementById("empty-library");

   if (libraryStats) {
      libraryStats.textContent = `${likedSongs.length} songs`;
   }

   if (likedSongs.length === 0) {
      if (librarySongsList) librarySongsList.style.display = "none";
      if (emptyLibrary) emptyLibrary.style.display = "block";
   } else {
      if (emptyLibrary) emptyLibrary.style.display = "none";
      if (librarySongsList) {
         librarySongsList.style.display = "block";
         renderLibrarySongs();
      }
   }
}

function renderLibrarySongs() {
   const container = document.getElementById("library-songs-list");
   if (!container) return;

   container.innerHTML = likedSongs
      .map(
         (song, index) => `
        <div class="song-row" onclick="playSongById(${song.id})">
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
        </div>
    `
      )
      .join("");
}

function playSongById(songId) {
   const song = musicData.find((s) => s.id === songId);
   if (song) {
      loadSong(song);
      isPlaying = true;
      const playIcon = playBtn.querySelector("i");
      if (playIcon) playIcon.className = "fas fa-pause";
   }
}

function playAllLikedSongs() {
   if (likedSongs.length > 0) {
      currentPlaylist = likedSongs;
      loadSong(likedSongs[0]);
      isPlaying = true;
      const playIcon = playBtn.querySelector("i");
      if (playIcon) playIcon.className = "fas fa-pause";
   }
}

function loadBrowsePage() {
   // Initialize search results container
   const searchResults = document.getElementById("search-results");
   if (searchResults) {
      searchResults.style.display = "none";
   }
}

function handleSearch() {
   const searchInput = document.getElementById("search-input");
   const searchResults = document.getElementById("search-results");
   const resultsContainer = document.getElementById("results-container");

   if (!searchInput || !searchResults || !resultsContainer) return;

   const query = searchInput.value.toLowerCase().trim();

   if (query === "") {
      searchResults.style.display = "none";
      return;
   }

   // Filter songs based on search query
   const filteredSongs = musicData.filter(
      (song) =>
         song.title.toLowerCase().includes(query) ||
         song.artist.toLowerCase().includes(query) ||
         song.album.toLowerCase().includes(query) ||
         song.genre.toLowerCase().includes(query)
   );

   // Show search results
   searchResults.style.display = "block";

   if (filteredSongs.length > 0) {
      resultsContainer.innerHTML = filteredSongs
         .map(
            (song) => `
            <div class="playlist-card" onclick="playSongById(${song.id})">
                <img src="${song.image}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `
         )
         .join("");
   } else {
      resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${query}"</h3>
                <p>Try searching for something else.</p>
            </div>
        `;
   }
}

function filterByGenre(genre) {
   const searchResults = document.getElementById("search-results");
   const resultsContainer = document.getElementById("results-container");

   if (!searchResults || !resultsContainer) return;

   // Filter songs by genre
   const filteredSongs = musicData.filter(
      (song) => song.genre.toLowerCase() === genre.toLowerCase()
   );

   // Show results
   searchResults.style.display = "block";

   // Update search results title
   const resultsTitle = searchResults.querySelector("h2");
   if (resultsTitle) {
      resultsTitle.textContent = `${
         genre.charAt(0).toUpperCase() + genre.slice(1)
      } Music`;
   }

   if (filteredSongs.length > 0) {
      resultsContainer.innerHTML = filteredSongs
         .map(
            (song) => `
            <div class="playlist-card" onclick="playSongById(${song.id})">
                <img src="${song.image}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `
         )
         .join("");
   } else {
      resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No ${genre} songs found</h3>
                <p>Try exploring other genres.</p>
            </div>
        `;
   }
}

// Add data attributes to like buttons for the songs in top charts
document.addEventListener("DOMContentLoaded", function () {
   const chartLikeButtons = document.querySelectorAll(".chart-item .like-btn");
   chartLikeButtons.forEach((btn, index) => {
      btn.dataset.songId = index + 1; // Assign song IDs based on chart position
   });
});

// Progress bar simulation
function simulateProgress() {
   if (!isPlaying) return;

   const progressFill = document.querySelector(".progress-fill");
   if (progressFill) {
      let width = 0;
      const interval = setInterval(() => {
         if (!isPlaying) {
            clearInterval(interval);
            return;
         }
         width += 0.1;
         progressFill.style.width = width + "%";

         if (width >= 100) {
            clearInterval(interval);
            playNextSong();
         }
      }, 100);
   }
}

// Start progress simulation when playing
const originalTogglePlayPause = togglePlayPause;
togglePlayPause = function () {
   originalTogglePlayPause();
   if (isPlaying) {
      simulateProgress();
   }
};

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
   if (e.target.tagName === "INPUT") return; // Don't interfere with input fields

   switch (e.code) {
      case "Space":
         e.preventDefault();
         togglePlayPause();
         break;
      case "ArrowLeft":
         e.preventDefault();
         playPreviousSong();
         break;
      case "ArrowRight":
         e.preventDefault();
         playNextSong();
         break;
   }
});

// Volume control simulation
const volumeBar = document.querySelector(".volume-bar");
if (volumeBar) {
   volumeBar.addEventListener("click", function (e) {
      const rect = volumeBar.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const volumeFill = volumeBar.querySelector(".volume-fill");
      if (volumeFill) {
         volumeFill.style.width = percent + "%";
      }
   });
}

// Progress bar interaction
const progressBar = document.querySelector(".progress");
if (progressBar) {
   progressBar.addEventListener("click", function (e) {
      const rect = progressBar.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const progressFill = progressBar.querySelector(".progress-fill");
      if (progressFill) {
         progressFill.style.width = percent + "%";
      }
   });
}
