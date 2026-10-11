# Shatter

Shatter is a browser-based gravity-well rock shooter. You pilot an inertial ship
around a bright central star, curve bullets through its pull, split armored rocks
down into fragments, and survive the saucer that periodically crosses the field.

This is the Warhead build: the ship carries a homing torpedo on a ten-second
recharge. It flies true through the well, locks onto targets in a narrow forward
cone, and destroys any rock outright.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite prints the local URL. The game runs entirely in the browser with no backend
or runtime network dependency.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/` with `dist/index.html` as its entry point.

## Controls

- `ARROWS` or `WASD`: turn and thrust
- `SPACE`: fire the gun
- `F`: launch the homing torpedo
- `ENTER` or `SPACE`: confirm menu items
- `ESC` or `P`: pause and resume
- `M`: mute sound
