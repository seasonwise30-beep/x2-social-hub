# X2 SOCIAL HUB — Music Library

Welcome to the official music folder of X2 SOCIAL HUB.

This folder contains the audio tracks used by the
built-in website music player.

## Folder Structure

assets/
└── music/
    ├── README.md
    ├── track-01.mp3
    ├── track-02.mp3
    ├── track-03.mp3
    └── artwork/
        ├── cover-01.jpg
        ├── cover-02.jpg
        └── cover-03.jpg

## Adding Music

The music player currently expects these filenames:

1. track-01.mp3
2. track-02.mp3
3. track-03.mp3

Place your audio files inside this folder.

## Supported Formats

- MP3
- WAV
- OGG
- AAC (browser support varies)

MP3 is recommended for compatibility.

## Playlist Configuration

Open:

js/music-player.js

Find the playlist configuration and update:

- Track title
- Artist name
- Audio source
- Artwork image

Example:

{
    title: "My Song",
    artist: "My Artist",
    src: "assets/music/track-01.mp3",
    artwork: "assets/music/artwork/cover-01.jpg"
}

## Important Notes

- Do not use copyrighted music without permission.
- Use royalty-free music or music you own.
- Music does not autoplay.
- Users must press Play to start playback.
- Keep audio files optimized for faster loading.
- Test playback after uploading to GitHub Pages.

## X2 SOCIAL HUB

Connect • Share • Explore
