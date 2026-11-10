/* =========================================================
   X2 SOCIAL HUB
   Music Player Controller
   Version: 1.0.0
========================================================= */

const X2MusicPlayer = {

    audio: null,

    currentTrackIndex: 0,

    isPlaying: false,

    isExpanded: false,

    playlist: [
        {
            id: "track-01",
            title: "Your First Track",
            artist: "X2 SOCIAL HUB",
            src: "assets/music/track-01.mp3",
            artwork: "assets/images/default-avatar.png"
        },
        {
            id: "track-02",
            title: "Your Second Track",
            artist: "X2 SOCIAL HUB",
            src: "assets/music/track-02.mp3",
            artwork: "assets/images/default-avatar.png"
        },
        {
            id: "track-03",
            title: "Your Third Track",
            artist: "X2 SOCIAL HUB",
            src: "assets/music/track-03.mp3",
            artwork: "assets/images/default-avatar.png"
        }
    ],

    selectors: {
        toggle: [
            "#music-toggle",
            "#play-pause",
            "[data-player='toggle']"
        ].join(","),

        next: [
            "#music-next",
            "[data-player='next']"
        ].join(","),

        previous: [
            "#music-previous",
            "[data-player='previous']"
        ].join(","),

        progress: [
            "#music-progress",
            "[data-player='progress']"
        ].join(","),

        volume: [
            "#music-volume",
            "[data-player='volume']"
        ].join(","),

        title: [
            "#music-title",
            "[data-player='title']"
        ].join(","),

        artist: [
            "#music-artist",
            "[data-player='artist']"
        ].join(","),

        artwork: [
            "#music-artwork",
            "[data-player='artwork']"
        ].join(","),

        currentTime: [
            "#music-current-time",
            "[data-player='current-time']"
        ].join(","),

        duration: [
            "#music-duration",
            "[data-player='duration']"
        ].join(","),

        playlist: [
            "#music-playlist",
            "[data-player='playlist']"
        ].join(","),

        expand: [
            "#music-expand",
            "[data-player='expand']"
        ].join(","),

        close: [
            "#music-close",
            "[data-player='close']"
        ].join(",")
    },

    /* -----------------------------------------------------
       INITIALIZE AUDIO
    ----------------------------------------------------- */

    initAudio() {

        if (this.audio) return;

        this.audio = new Audio();

        this.audio.preload = "metadata";

        this.audio.volume = 0.7;

        this.audio.loop = false;

        this.audio.autoplay = false;

        this.audio.addEventListener(
            "timeupdate",
            () => this.updateProgress()
        );

        this.audio.addEventListener(
            "loadedmetadata",
            () => this.updateDuration()
        );

        this.audio.addEventListener(
            "ended",
            () => this.nextTrack()
        );

        this.audio.addEventListener(
            "play",
            () => {
                this.isPlaying = true;
                this.updatePlayButton();
            }
        );

        this.audio.addEventListener(
            "pause",
            () => {
                this.isPlaying = false;
                this.updatePlayButton();
            }
        );

        this.audio.addEventListener(
            "error",
            () => {
                this.isPlaying = false;
                this.updatePlayButton();

                if (window.X2Hub) {
                    window.X2Hub.toast(
                        "Unable to load this music track.",
                        "error"
                    );
                }
            }
        );
    },

    /* -----------------------------------------------------
       LOAD TRACK
    ----------------------------------------------------- */

    loadTrack(index, autoplay = false) {

        if (!this.playlist.length) return;

        if (index < 0 || index >= this.playlist.length) {
            return;
        }

        this.currentTrackIndex = index;

        const track = this.playlist[index];

        this.audio.pause();

        this.audio.src = track.src;

        this.audio.load();

        this.updateTrackInformation();

        this.renderPlaylist();

        if (autoplay) {
            this.play();
        }
    },

    /* -----------------------------------------------------
       PLAY
    ----------------------------------------------------- */

    async play() {

        if (!this.audio) return;

        if (!this.audio.src && this.playlist.length) {
            this.loadTrack(this.currentTrackIndex, false);
        }

        if (!this.audio.src) {
            if (window.X2Hub) {
                window.X2Hub.toast(
                    "Add music tracks to the playlist first.",
                    "info"
                );
            }

            return;
        }

        try {

            await this.audio.play();

            this.isPlaying = true;

            this.updatePlayButton();

        } catch (error) {

            console.error(
                "[X2MusicPlayer] Playback failed:",
                error
            );

            if (window.X2Hub) {
                window.X2Hub.toast(
                    "Music could not be played. Check the audio file.",
                    "error"
                );
            }
        }
    },

    /* -----------------------------------------------------
       PAUSE
    ----------------------------------------------------- */

    pause() {

        if (!this.audio) return;

        this.audio.pause();

        this.isPlaying = false;

        this.updatePlayButton();
    },

    /* -----------------------------------------------------
       TOGGLE PLAYBACK
    ----------------------------------------------------- */

    togglePlayback() {

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    /* -----------------------------------------------------
       NEXT TRACK
    ----------------------------------------------------- */

    nextTrack() {

        if (!this.playlist.length) return;

        const nextIndex =
            (this.currentTrackIndex + 1) % this.playlist.length;

        this.loadTrack(nextIndex, true);
    },

    /* -----------------------------------------------------
       PREVIOUS TRACK
    ----------------------------------------------------- */

    previousTrack() {

        if (!this.playlist.length) return;

        // Restart current track if it has played for over 3 seconds.
        if (this.audio && this.audio.currentTime > 3) {

            this.audio.currentTime = 0;

            return;
        }

        const previousIndex =
            (
                this.currentTrackIndex -
                1 +
                this.playlist.length
            ) % this.playlist.length;

        this.loadTrack(previousIndex, true);
    },

    /* -----------------------------------------------------
       UPDATE PLAY BUTTON
    ----------------------------------------------------- */

    updatePlayButton() {

        document.querySelectorAll(
            this.selectors.toggle
        ).forEach(button => {

            button.textContent = this.isPlaying ? "Ⅱ" : "▶";

            button.setAttribute(
                "aria-label",
                this.isPlaying ? "Pause music" : "Play music"
            );

            button.setAttribute(
                "aria-pressed",
                String(this.isPlaying)
            );

            button.classList.toggle(
                "playing",
                this.isPlaying
            );
        });

        document.body.classList.toggle(
            "music-playing",
            this.isPlaying
        );
    },

    /* -----------------------------------------------------
       UPDATE TRACK INFORMATION
    ----------------------------------------------------- */

    updateTrackInformation() {

        const track = this.playlist[
            this.currentTrackIndex
        ];

        if (!track) return;

        document.querySelectorAll(
            this.selectors.title
        ).forEach(element => {
            element.textContent = track.title;
        });

        document.querySelectorAll(
            this.selectors.artist
        ).forEach(element => {
            element.textContent = track.artist;
        });

        document.querySelectorAll(
            this.selectors.artwork
        ).forEach(element => {

            element.src = track.artwork ||
                "assets/images/default-avatar.png";

            element.alt = `${track.title} artwork`;
        });

        this.updatePlayButton();
    },

    /* -----------------------------------------------------
       FORMAT TIME
    ----------------------------------------------------- */

    formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    },

    /* -----------------------------------------------------
       UPDATE PROGRESS
    ----------------------------------------------------- */

    updateProgress() {

        if (!this.audio) return;

        const current = this.audio.currentTime || 0;

        const duration = this.audio.duration || 0;

        const percentage = duration
            ? (current / duration) * 100
            : 0;

        document.querySelectorAll(
            this.selectors.progress
        ).forEach(progress => {

            if (progress.type === "range") {

                progress.value = percentage;

                progress.max = 100;

            } else {

                progress.style.width = `${percentage}%`;
            }
        });

        document.querySelectorAll(
            this.selectors.currentTime
        ).forEach(element => {
            element.textContent = this.formatTime(current);
        });
    },

    /* -----------------------------------------------------
       UPDATE DURATION
    ----------------------------------------------------- */

    updateDuration() {

        if (!this.audio) return;

        document.querySelectorAll(
            this.selectors.duration
        ).forEach(element => {
            element.textContent = this.formatTime(
                this.audio.duration
            );
        });
    },

    /* -----------------------------------------------------
       SEEK TRACK
    ----------------------------------------------------- */

    seekTrack(value) {

        if (!this.audio || !Number.isFinite(this.audio.duration)) {
            return;
        }

        const percentage = Math.min(
            100,
            Math.max(0, Number(value))
        );

        this.audio.currentTime =
            (percentage / 100) * this.audio.duration;
    },

    /* -----------------------------------------------------
       SET VOLUME
    ----------------------------------------------------- */

    setVolume(value) {

        if (!this.audio) return;

        const volume = Math.min(
            1,
            Math.max(0, Number(value))
        );

        this.audio.volume = volume;
    },

    /* -----------------------------------------------------
       RENDER PLAYLIST
    ----------------------------------------------------- */

    renderPlaylist() {

        const container = document.querySelector(
            this.selectors.playlist
        );

        if (!container) return;

        container.replaceChildren();

        this.playlist.forEach((track, index) => {

            const button = document.createElement("button");

            button.type = "button";

            button.className = "music-playlist-item";

            button.classList.toggle(
                "active",
                index === this.currentTrackIndex
            );

            button.setAttribute(
                "aria-current",
                index === this.currentTrackIndex ? "true" : "false"
            );

            const title = document.createElement("span");

            title.textContent = track.title;

            const artist = document.createElement("span");

            artist.textContent = track.artist;

            button.append(title, artist);

            button.addEventListener("click", () => {
                this.loadTrack(index, true);
            });

            container.appendChild(button);
        });
    },

    /* -----------------------------------------------------
       EXPAND PLAYER
    ----------------------------------------------------- */

    expandPlayer() {

        const player = document.querySelector(
            "#music-player"
        );

        if (!player) return;

        player.classList.add("expanded");

        this.isExpanded = true;
    },

    /* -----------------------------------------------------
       COLLAPSE PLAYER
    ----------------------------------------------------- */

    collapsePlayer() {

        const player = document.querySelector(
            "#music-player"
        );

        if (!player) return;

        player.classList.remove("expanded");

        this.isExpanded = false;
    },

    /* -----------------------------------------------------
       EVENT LISTENERS
    ----------------------------------------------------- */

    initEvents() {

        document.addEventListener("click", event => {

            if (event.target.closest(this.selectors.toggle)) {
                this.togglePlayback();
            }

            if (event.target.closest(this.selectors.next)) {
                this.nextTrack();
            }

            if (event.target.closest(this.selectors.previous)) {
                this.previousTrack();
            }

            if (event.target.closest(this.selectors.expand)) {
                this.expandPlayer();
            }

            if (event.target.closest(this.selectors.close)) {
                this.collapsePlayer();
            }
        });

        document.addEventListener("input", event => {

            if (event.target.matches(this.selectors.progress)) {
                this.seekTrack(event.target.value);
            }

            if (event.target.matches(this.selectors.volume)) {
                this.setVolume(event.target.value);
            }
        });
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.initAudio();

        this.initEvents();

        this.loadTrack(0, false);

        this.renderPlaylist();

        this.updatePlayButton();

        console.log("[X2MusicPlayer] Music player initialized.");
    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2MusicPlayer = X2MusicPlayer;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initMusicPlayer() {

    X2MusicPlayer.init();

}