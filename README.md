# YouTube Music Remote

Control [YouTube Music](https://github.com/th-ch/youtube-music) from your phone, tablet, or another computer.

## Development

```bash
yarn
yarn start
```

Note that this will not work on Expo Go, as some libraries used are not supported by it.

## Limitations

There are some limitations to the app mostly due to the limitations of the API server:

- [Seeking](https://github.com/th-ch/youtube-music/issues/2582) is not yet supported.
- Queue is for viewing only.
- Some player button states (repeat, like/dislike, etc.) are indeterminate.
