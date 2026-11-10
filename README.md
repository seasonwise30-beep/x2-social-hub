# 👑 X2 SOCIAL HUB

### Connect • Share • Explore

A premium, modern, multi-profile social media hub inspired by
Apple Liquid Glass and futuristic iOS design.

X2 SOCIAL HUB brings social profiles, Instagram QR codes,
music playback, profile discovery and multiple sharing
options together in one responsive website.

---

## ✨ Features

### 🎨 1. Eight Visual Themes

Choose from eight different themes:

1. Liquid Glass
2. Midnight Black
3. iOS Light
4. iOS Dark
5. Sunset Gradient
6. Aurora
7. Cyberpunk
8. Minimal White

Theme preferences are saved using localStorage.

### 👥 2. Profile Directory

- Browse social media profiles.
- Search profiles by name.
- Filter profiles by category.
- View featured profiles.
- Open individual profile pages.
- Load profile information from JSON.

### 📱 3. Individual Profile Pages

Each profile can include:

- Profile picture.
- Display name.
- Instagram username.
- Biography.
- Social links.
- QR code.
- Share profile.
- Copy profile link.
- Direct Instagram access.

### 📷 4. Instagram QR System

- Display original QR images.
- Open QR in a modal.
- Zoom QR images.
- Download QR images.
- Share QR images where supported.
- Copy Instagram profile links.

### 🎵 5. Music Player

- Play and pause.
- Previous and next tracks.
- Volume control.
- Progress slider.
- Track information.
- Playlist support.
- No automatic music playback.

### 🔗 6. Sharing System

Supported sharing options:

- Native mobile sharing.
- WhatsApp.
- Facebook.
- Telegram.
- X (Twitter).
- Email.
- Copy link.

### 📩 7. Forms

Two forms are included:

- Contact form.
- Profile submission form.

Form submissions use Formspree.

### 📱 8. Responsive Design

Designed for:

- Android phones.
- iPhones.
- Tablets.
- Laptops.
- Desktop monitors.

### ♿ 9. Accessibility

Includes:

- Semantic HTML.
- Accessible form labels.
- Keyboard-friendly controls.
- Reduced-motion support.
- Responsive layouts.

---

# 📁 Project Structure

x2-social-hub/

├── index.html

├── profiles.html

├── profile.html

├── add-profile.html

├── contact.html

│

├── assets/

│   ├── images/

│   │   ├── logo.png

│   │   ├── default-avatar.png

│   │   └── qr/

│   │       └── rohuuu-qr.png

│   │

│   ├── icons/

│   │   └── icons.svg

│   │

│   └── music/

│       ├── README.md

│       ├── track-01.mp3

│       ├── track-02.mp3

│       └── track-03.mp3

│

├── css/

│   ├── style.css

│   ├── themes.css

│   ├── responsive.css

│   └── animations.css

│

├── js/

│   ├── app.js

│   ├── themes.js

│   ├── navigation.js

│   ├── profiles.js

│   ├── profile-view.js

│   ├── music-player.js

│   ├── qr.js

│   ├── share.js

│   └── contact.js

│

├── data/

│   └── profiles.json

│

├── .nojekyll

└── README.md

---

# ⚙️ Installation

## Step 1 — Download the project

Download or clone the repository.

## Step 2 — Open the project

Open the project folder in Visual Studio Code.

## Step 3 — Run a local server

Because the project uses JavaScript modules and fetch(),
run it through a local web server.

You can use the VS Code Live Server extension.

Do not rely on opening index.html directly using file://.

---

# 🧑‍💻 Adding a New Profile

Open:

data/profiles.json

Add a new profile object inside the profiles array.

Example:

{
  "id": "new-profile",
  "fullName": "Example Name",
  "displayName": "Example Profile",
  "username": "example.username",
  "category": "creator",
  "bio": "Welcome to my profile.",
  "avatar": "assets/images/default-avatar.png",
  "qrImage": "",
  "instagram": "https://www.instagram.com/example.username/",
  "whatsapp": "",
  "email": "",
  "website": "",
  "featured": false,
  "verified": false,
  "active": true
}

Use a unique ID for every profile.

Keep the JSON syntax valid.

---

# 📷 Replacing the QR Code

Place the original QR image here:

assets/images/qr/rohuuu-qr.png

Keep the filename unchanged unless you also update
the profile data.

---

# 🎵 Adding Music

Place your permitted MP3 files inside:

assets/music/

The music player currently references:

- track-01.mp3
- track-02.mp3
- track-03.mp3

Update the playlist configuration inside:

js/music-player.js

Use music that you own or have permission to distribute.

---

# 📩 Formspree Configuration

The contact and profile submission forms require
separate Formspree endpoints.

Open:

js/contact.js

Replace:

YOUR_CONTACT_FORM_ID

and:

YOUR_PROFILE_FORM_ID

with your actual Formspree form IDs.

Configure spam protection and test both forms.

---

# 🌐 GitHub Pages Deployment

## Step 1 — Create a GitHub account

Visit:

https://github.com/

Create an account or sign in.

## Step 2 — Create a repository

1. Click New Repository.
2. Enter the name:

   x2-social-hub

3. Select Public.
4. Create the repository.

## Step 3 — Upload project files

Upload the complete project folder structure.

Make sure index.html is in the repository root.

Do not upload only the HTML files.

## Step 4 — Enable GitHub Pages

1. Open your repository.
2. Select Settings.
3. Select Pages.
4. Under Build and deployment, choose:

   Deploy from a branch

5. Select:

   Branch: main

   Folder: / (root)

6. Click Save.

## Step 5 — Open your website

Your website address will normally be:

https://YOUR-USERNAME.github.io/x2-social-hub/

Replace YOUR-USERNAME with your GitHub username.

GitHub Pages may take a few minutes to publish the website.

---

# 🧪 Testing Checklist

Before publishing, test the following:

## Homepage

- [ ] Homepage loads.
- [ ] Navigation works.
- [ ] Featured profiles appear.
- [ ] Theme selector opens.
- [ ] All eight themes work.

## Profile Directory

- [ ] Profiles load from JSON.
- [ ] Search works.
- [ ] Category filters work.
- [ ] Profile links open correctly.

## Profile Page

- [ ] Profile information loads.
- [ ] Instagram link works.
- [ ] QR modal opens.
- [ ] QR download works.
- [ ] Copy link works.
- [ ] Share options work.

## Music Player

- [ ] Play and pause work.
- [ ] Next and previous work.
- [ ] Volume works.
- [ ] Progress slider works.
- [ ] Missing audio files are handled.

## Forms

- [ ] Required fields validate.
- [ ] Email validation works.
- [ ] Formspree endpoints are configured.
- [ ] Contact form submits.
- [ ] Profile form submits.

## Mobile

- [ ] Navigation works.
- [ ] Buttons fit the screen.
- [ ] No horizontal overflow.
- [ ] Modals fit small screens.
- [ ] Themes work on mobile.

---

# 🔒 Important Notes

1. GitHub Pages hosts static websites.
2. Profile submissions do not automatically update profiles.json.
3. Submitted profiles should be reviewed before manually
   adding them to the profile database.
4. Formspree is an external form service.
5. Never place private API keys or passwords in public files.
6. Test all asset paths after deployment.
7. Use HTTPS when testing browser sharing and clipboard features.

---

# 🛠️ Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- SVG
- JSON
- localStorage
- Formspree
- GitHub Pages

No frontend framework is required.

---

# 👑 About X2 SOCIAL HUB

X2 SOCIAL HUB is designed to make social profile
discovery simple, beautiful and interactive.

Connect with creators.
Discover new profiles.
Share your identity.

### X2 SOCIAL HUB

CONNECT • SHARE • EXPLORE

© 2026 X2 SOCIAL HUB
