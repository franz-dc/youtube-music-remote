<h1 align='center'>
  <img src="https://github.com/franz-dc/youtube-music-remote/blob/main/images/logo.webp" width="120px" style="max-width: 100%" alt="YouTube Music Remote">
  <br>
  YouTube Music Remote
</h1>

Control [YouTube Music](https://github.com/th-ch/youtube-music) from your phone, tablet, or another computer.

Download the app [here](https://github.com/franz-dc/youtube-music-remote/releases/latest)!

For the web version, see the [dedicated section](#web-version) below.

## Screenshots

<p float="left">
  <img src="https://github.com/franz-dc/youtube-music-remote/blob/main/images/player.webp" width="200" style="max-width: 100%; margin-right: 8px;" alt="Player">
  <img src="https://github.com/franz-dc/youtube-music-remote/blob/main/images/queue.webp" width="200" style="max-width: 100%;" alt="Queue">
</p>

## Getting Started

1. Enable the API Server plugin in YouTube Music.
2. Set the authorization strategy to `No authorization`.
3. Install YouTube Music Remote to your device or access the web version.
4. Configure the connection settings.
5. Enjoy controlling YouTube Music remotely!

## Web Version

The web version can be accessed [here](https://youtube-music-remote.vercel.app) after doing some configuration on your browser.

You need to disable a security feature for the site first. YouTube Music's API Server is hosted locally using HTTP and the browser blocks requests to the server for that reason.

### Chrome (and other Chromium-based browsers)

1. Go to the web app.
2. Click the lock or settings icon on the left side of the address bar.
3. Click `Site settings`.
4. Scroll down to `Insecure content` and select `Allow`.
5. Reload the page.

### Firefox

1. Go to the web app and go to the [settings page](https://youtube-music-remote.vercel.app/settings).
2. Configure your connection settings.
3. Click the lock icon on the left side of the address bar.
4. Click `Connection secure`.
5. Click `Disable protection for now`.

For Firefox, you have to disable the protection every time you reopen your browser.

## Development

```bash
yarn
yarn android # or yarn web
```

- Note that this will not work on Expo Go, as some libraries used are not supported by it.
- iOS is not yet tested to work due to no access to an Apple device.

## Limitations

There are some limitations to the app mostly due to the limitations of the API server:

- Authorization strategy must be set to `No authorization` in the plugin configuration (for now).
- Some player button states (shuffle, like/dislike, etc.) are indeterminate.
