# Simple Development Server

a straight forward server, for building typescript / tailwindcss web apps.

## initialization

you'll need to init the project after cloning the project.

- using yarn

```bash
yarn
yarn scripts-build
```

- using npm

```bash
npm install
npm run scripts-build
```

## start

in start mode, you'll get auto page refreshes when the src or public directory change.

- using yarn

```bash
yarn start
```

- using npm

```bash
npm run start
```

### parameters

- port / p - controls the port of the server

```
yarn start --port 8080
```

- open / o - controls whether to open the browser

```
yarn start --no-open
```

- debounce / d - controls filesystem debounce rate for JS / CSS building

```
yarn start -d 200
```

## build

in build mode, you'll get type checks with no server

- using yarn

```bash
yarn build
```

- using npm

```bash
npm run build
```

## static

in static mode, you'll simply serve the resources in public

- using yarn

```bash
yarn static
```

- using npm

```bash
npm run static
```
