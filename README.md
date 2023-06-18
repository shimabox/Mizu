# Mizu

`Mizu` is a joke script that simulates water(H2o) generation in JavaScript.

![Mizu](https://github.com/shimabox/Mizu/assets/2285196/b5f3b538-be54-44ee-b4ea-3ce1679587ae)

## Demo

https://shimabox.github.io/Mizu/

## Run

- node
  - v18.16.0
- npm
  - 9.5.1

```sh
git clone git@github.com:shimabox/Mizu.git && cd Mizu
npm ci
npx http-server

# you are accessible here.
http://127.0.0.1:8080
```

## Develop

### Run test (by jest)

```sh
npm run test
```

#### Output coverage.

```sh
npm run test:coverage
```

See `coverage/lcov-report/index.html` for the report.

### Run formatter (by prettier)

```
npm run format
# or
npm run format:fix
```

### Run lint (by eslint)

```
npm run lint
# or
npm run lint:fix
```

### Run ci

```
npm run ci
```

The following commands are executed in order.

- npm run format
- npm run lint
- npm run test