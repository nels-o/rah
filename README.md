# `rah`

`rah` is the `r`eact `a`pplication `h`arness. It is a combination of project management tools, build system, and development server features derived from [`react-boilerplate`](https://github.com/react-boilerplate/react-boilerplate). I use this to build static single page applications and unify deployment processes. The goal is simple -- making changes to any application built against `react-boilerplate` requires making manual changes to every project that uses it. That's slow, inefficient, tedious, and no fun at all.

To fix that, we've inverted the server and build components of `react-boilerplate`. Instead of forming the basis of your project's folder structure that functionality is now just another module dependency that can be installed like so:

### Installation

```
npm install -D git+ssh://git@github.com:nels-o/rah.git
```

### Usage through NPM scripts

To use it, you will need to add the following to your `package.json`

```
  ...
  "scripts": {
    "start": "cross-env NODE_ENV=development node ./node_modules/rah/server",
    "build:dll": "node ./node_modules/rah/internals/scripts/dependencies.js"
    ...
  },
  ...
```

To make use of the CLI to generate containers and components, you will need to add the following to your `package.json`. For example, from the root directory of an application run `npm run generate [option]` Options are container, component, and language.

```
  ...
  "scripts": {
    "generate": "plop --plopfile node_modules/rah/internals/generators/index.js",
    ...
  },
  ...
```

Other functionality is in progress!

## Known issues

### Install time

These issues are not strictly harmless, in the sense that they represent a large amount of ongoing meaintenance work for our codebase, but they do not impact runtime code as of right this second.

```
npm WARN deprecated react-router-redux@5.0.0-alpha.9: This project is no longer maintained.
npm WARN deprecated circular-json@0.3.3: CircularJSON is in maintenance only, flatted is its successor.
npm WARN deprecated react-dom@16.4.1: This version of react-dom/server contains a minor vulnerability. Please update react-dom to 16.4.2+. Learn more: https://fb.me/cve-2018-6341
npm WARN deprecated babel@6.23.0: In 6.x, the babel package has been deprecated in favor of babel-cli. Check https://opencollective.com/babel to support the Babel maintainers
npm WARN deprecated browserslist@1.7.7: Browserslist 2 could fail on reading Browserslist >3.0 config used in other tools.
npm WARN rollback Rolling back readable-stream@2.3.6 failed (this is probably harmless): EPERM: operation not permitted, lstat 'C:\Users\nelso\src\rpe\serverless\test-app\node_modules\fsevents\node_modules'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN jest-styled-components@5.0.1 requires a peer of styled-components@^2.0.0 || ^3.0.2 but none is installed. You must install peer dependencies yourself.
npm WARN test-app@0.0.1 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.7 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.7: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
```

### DLL compilation

These are related to the filesize issues that have their own section below.

```
[BABEL] Note: The code generator has deoptimised the styling of "... /node_modules/lodash/lodash.js" as it exceeds the max of "500KB".
[BABEL] Note: The code generator has deoptimised the styling of "... /node_modules/brace/index.js" as it exceeds the max of "500KB".
```

### Filesize

Currently, `rahDeps.dll.js` comes in around 2.14 MiB for a _small project_. That's massive by any stretch. We are actively working to get that down to a more reasonable size. The bundle is cached in several tiers, so it isn't usually an issue after first page load. Since our primary target user is a person we have an ongoing relationship with, we can generally assume that they will not regularly see the impact of this bundle size, but that's no reason to be this wasteful.

Application bundles will vary, but we've seen sizes as large as 12 MiB for moderate size projects with a default `react-boilerplate` installation. There is a lot of work to do on this front.
