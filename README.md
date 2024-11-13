# YouTube Music Remote

Control [YouTube Music](https://github.com/th-ch/youtube-music) from your phone, tablet, or another computer.

## Screenshots

<p float="left">
  <img src="https://github.com/franz-dc/youtube-music-remote/blob/main/images/player.webp" width="200" style="max-width: 100%; margin-right: 8px;" alt="Player">
  <img src="https://github.com/franz-dc/youtube-music-remote/blob/main/images/queue.webp" width="200" style="max-width: 100%;" alt="Queue">
</p>

## Development

```bash
yarn
yarn start
```

Note that this will not work on Expo Go, as some libraries used are not supported by it.

## Limitations

There are some limitations to the app mostly due to the limitations of the API server:

- Authorization strategy must be set to `No authorization` in the plugin configuration (for now).
- [Seeking](https://github.com/th-ch/youtube-music/issues/2582) is not yet supported.
- Queue is for viewing only.
- Some player button states (repeat, like/dislike, etc.) are indeterminate.
