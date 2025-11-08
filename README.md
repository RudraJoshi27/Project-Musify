# Musify - Frontend Music App

A beautiful, responsive music streaming app frontend built with HTML, CSS, and JavaScript.

## Features

### 🏠 Home Page

-  Featured songs section with the most popular tracks
-  Recently played songs (automatically updated when you play music)
-  Popular artists showcase
-  Beautiful gradient background and modern UI

### 🔍 Browse Page

-  Complete music library with 15+ sample songs
-  Search functionality (search by song title, artist, or genre)
-  Genre filtering (Pop, Rock, Jazz, Classical, Electronic, Hip Hop)
-  Real-time search results with count display

### ❤️ Library Page

-  Personal collection of liked songs
-  Library statistics (total liked songs and duration)
-  List view of all liked songs
-  Clear library functionality

### 🎵 Music Player

-  Bottom-fixed music player with controls
-  Play/Pause, Previous/Next functionality
-  Progress bar with visual feedback
-  Volume control slider
-  Displays current song information
-  Keyboard shortcuts support

## How to Use

1. **Navigation**: Use the top navigation bar to switch between Home, Browse, and Library pages
2. **Playing Music**: Click the play button on any song card to start playing
3. **Liking Songs**: Click the heart icon on any song to add/remove it from your library
4. **Searching**: Use the search bar on the Browse page to find specific songs
5. **Filtering**: Click genre buttons to filter songs by category
6. **Keyboard Shortcuts**:
   -  `Space`: Play/Pause
   -  `Arrow Left`: Previous song
   -  `Arrow Right`: Next song
   -  `1`: Go to Home page
   -  `2`: Go to Browse page
   -  `3`: Go to Library page

## Sample Content

The app includes 15 sample songs across various genres:

-  Pop: Blinding Lights, Shape of You, Watermelon Sugar, As It Was
-  Rock: Bohemian Rhapsody, Stairway to Heaven, Hotel California
-  Jazz: Take Five, Blue in Green
-  Classical: Für Elise, Claire de Lune
-  Electronic: Strobe, Scary Monsters and Nice Sprites
-  Hip Hop: Lose Yourself, HUMBLE.

## Local Storage

The app uses browser local storage to persist:

-  Liked songs collection
-  Recently played tracks
-  User preferences

## Technical Features

-  **Responsive Design**: Works on desktop, tablet, and mobile devices
-  **Modern CSS**: Uses CSS Grid, Flexbox, and modern properties
-  **Smooth Animations**: Hover effects, transitions, and loading animations
-  **Accessibility**: Proper semantic HTML and keyboard navigation
-  **Performance**: Efficient DOM manipulation and event handling

## Browser Compatibility

Works on all modern browsers including:

-  Chrome 60+
-  Firefox 55+
-  Safari 12+
-  Edge 79+

## File Structure

```
project/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

You can easily customize the app by:

1. **Adding More Songs**: Edit the `sampleSongs` array in `script.js`
2. **Changing Colors**: Modify the CSS color variables and gradients
3. **Adding Features**: Extend the JavaScript functionality
4. **Styling**: Update the CSS for different looks

## Future Enhancements

This frontend can be extended with:

-  Real audio playback using Web Audio API
-  Backend integration for user accounts
-  Playlist creation and management
-  Social features and sharing
-  Advanced search and recommendations
-  Audio visualization

## Getting Started

1. Make sure you have XAMPP installed and running
2. Place all files in your `htdocs/project/` directory
3. Open your browser and go to `http://localhost/project/`
4. Enjoy exploring the Musify music app!

---

**Note**: This is a frontend-only demonstration. Audio playback is simulated - no actual music files are played.
