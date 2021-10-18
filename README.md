# Angular12 + Webpack5 + inline loader - issue reproduction

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.10.

## Step 1: create a new Angular12 workspace
```
$ npx -p @angular/cli@12 ng new angular12-webpack5-inline-loader-repro

? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? CSS

CREATE angular12-webpack5-inline-loader-repro/angular.json (3231 bytes)
CREATE angular12-webpack5-inline-loader-repro/package.json (1102 bytes)
CREATE angular12-webpack5-inline-loader-repro/README.md (1081 bytes)
CREATE angular12-webpack5-inline-loader-repro/tsconfig.json (783 bytes)
CREATE angular12-webpack5-inline-loader-repro/.editorconfig (274 bytes)
CREATE angular12-webpack5-inline-loader-repro/.gitignore (604 bytes)
CREATE angular12-webpack5-inline-loader-repro/.browserslistrc (703 bytes)
CREATE angular12-webpack5-inline-loader-repro/karma.conf.js (1455 bytes)
CREATE angular12-webpack5-inline-loader-repro/tsconfig.app.json (287 bytes)
CREATE angular12-webpack5-inline-loader-repro/tsconfig.spec.json (333 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/favicon.ico (948 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/index.html (320 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/main.ts (372 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/polyfills.ts (2820 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/styles.css (80 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/test.ts (788 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/assets/.gitkeep (0 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/environments/environment.prod.ts (51 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/environments/environment.ts (658 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/app/app.module.ts (314 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/app/app.component.html (24585 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/app/app.component.spec.ts (1052 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/app/app.component.ts (242 bytes)
CREATE angular12-webpack5-inline-loader-repro/src/app/app.component.css (0 bytes)
√ Packages installed successfully.
```

## Step 2: Create `test.css` file

```
// src/assets/test.css

body {
    background-color: red;
}
```

## Step 3: Import `test.css` file into `app.component.ts` and log it to the console

_Please note, we're using inline loader syntax here...
We'd expect `typeof test` to be `object` and the `test` to be
a navigable object in the browser console_

```
// src/app/app.component.ts

import { Component } from '@angular/core';

import test from 'css-loader!src/assets/test.css';
console.log('typeof test: ', typeof test);
console.log(test);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular12-webpack5-inline-loader-repro';
}
```

## Step 4: Fix typescript error: _TS2307: Cannot find module 'src/assets/test.css' or its corresponding type declarations._

Importing css files is not supported by Angular out-of-the-box. Thus we have to provide
a matching module declaration. Please note, that this is not possible for @storybook, thus
I don't think, this is related to the problem...

```
// /typings.d.ts

declare module '*.css';
```
```
// tsconfig.app.json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "typings.d.ts"
  ]
}
```

## Step 5: Install css-loader
```
$ npm i css-loader
```

## Step 6: Run the app
```
$ npm run start
```

[Open the app](http://localhost:4200) in the browser and press [F12] to open the dev tools.

# Issue description

In the console we would expect `typeof test: object` and a navigable output showing the object's properties.

However, what we see instead is `typeof test: string` and the js-code returned by the css-loader:
> using `import test from 'src/assets/test.css';`
> ![screenshot-1][1]

> using `import * as test from 'src/assets/test.css';`
> ![screenshot-2][2]
 
[1]: src/assets/screenshot-1.png
[2]: src/assets/screenshot-2.png
