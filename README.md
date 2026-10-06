# Fake WhatsApp Chat Generator 💬

A lightweight, completely client-side Web Application built with **Vanilla HTML, CSS, and JavaScript** that allows users to easily create realistic fake WhatsApp conversations.

## 🌟 Features

- **Realistic Dark Mode UI:** Designed to closely match the native WhatsApp Android interface.
- **Dynamic Messaging:** Easily add incoming or outgoing messages, deleted messages, and date dividers.
- **Auto Reply Context:** Automatically handles replied messages with dynamic colors matching the sender's avatar.
- **Smart Grouping:** Chat tails automatically collapse for consecutive messages from the same sender, identical to real WhatsApp behavior.
- **Export to Image:** Export your generated conversation into a clean PNG image instantly using HTML2Canvas.
- **No Database / Server:** 100% Client-side. No sign-ups, no data collected, no servers involved.

## 🛠️ Built With

- **HTML5:** Semantic structure and layout.
- **CSS3:** Vanilla CSS with custom properties (CSS variables) for robust styling.
- **JavaScript (ES6):** State management, DOM manipulation, and dynamic rendering.
- [HTML2Canvas](https://html2canvas.hertzen.com/): Third-party library loaded via CDN for exporting the DOM to an image.

## 🚀 How to Use

1. Open `index.html` in your web browser.
2. Configure the contact name and optional profile picture.
3. Select an avatar color theme from the provided swatches.
4. Use the Add Buttons on the left panel to build your chat timeline.
5. Click **"📸 Unduh Gambar (PNG)"** to save your masterpiece.

## 🤖 Notes for AI / Developers

This project strictly relies on vanilla JS DOM rebuilding (`renderApp`). When attempting to modify or extend the codebase:
- Use `<span>` and `appendChild` for text generation instead of `innerHTML` to avoid breaking `html2canvas` whitespace rendering.
- Do not alter the core `messages` array structure.
- A comprehensive AI guide is embedded within the application itself. Click **"🤖 Panduan Khusus AI"** in the UI for deeper technical documentation and architecture rules.

---
*Created for creative and entertainment purposes only.*
