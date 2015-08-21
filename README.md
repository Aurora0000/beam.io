# beam.io
[![Download](https://img.shields.io/badge/release-v0.1.0--alpha2-blue.svg)](https://github.com/Aurora0000/beam.io/releases/latest)
[![Dependency Status](https://david-dm.org/Aurora0000/beam.io.svg)](https://david-dm.org/Aurora0000/beam.io)
[![devDependency Status](https://david-dm.org/Aurora0000/beam.io/dev-status.svg)](https://david-dm.org/Aurora0000/beam.io#info=devDependencies)

Looking for [:arrow_down:releases](https://github.com/Aurora0000/beam.io/releases)? Available for Windows, Linux and Mac OS X.

Beam.io is an IRC client powered by 
[GitHub Electron](https://github.com/atom/electron), 
[Node.js](https://nodejs.org) and open web technologies such as HTML5, CSS3 
and JavaScript (ES5 and AngularJS).


## :question: Why choose to use beam.io?
Since its creation in 1988 (27 years ago!), IRC has been one of the greatest 
and most widely supported chat protocols ever. However, IRC clients themselves
have barely changed, looking almost no different from 10 years ago, and only
barely different from the oldest clients such as 
[ircII](https://upload.wikimedia.org/wikipedia/commons/9/94/Ircii.png).

So, we set out to create a modern, user-friendly client that would be 
aesthetically pleasing, while remaining practical and streamlined so that 
it's still easy to chat with others. In addition to all of this, we wanted to
make the client cross-platform, fast and quick to set up. This led to the 
creation of beam.io, which we hope has all of these features, and more.

## :star: Current Features
- Channels and private messaging
- Identicons for quick, visual representation of users
- All core IRC commands
- Graphical interface available for most common commands (e.g. /join)

## :notebook_with_decorative_cover: Planned Features
- Improved, responsive UI
- Plugin system
- Theming system
- Connection to multiple networks

## :bug: Known Bugs
#### beam.io will not work if the path to it contains accents or other non-ASCII characters
**Workaround**: Move beam.io to a path without accents.

#### All Bugs
Please see [this list](https://github.com/Aurora0000/beam.io/labels/bug) for all known bugs.


## :construction: For Developers :construction:
### :wrench: Building beam.io

```bash
git clone https://github.com/Aurora0000/beam.io
cd beam.io
npm i
npm i electron-prebuilt -g
electron .
```

### :package: Packaging beam.io
(assuming build dependencies installed already)
```bash
npm i gulp -g
gulp package-platform-arch
(e.g. gulp package-linux-x64)
```

Releases are dropped into releases/beam-platform-arch.zip. **Do not commit 
release zips**!

### :octocat: Collaborating
Pull requests are welcome. All code must be in ES5 (that means no 
CoffeeScript, no TypeScript, no ES6!).


## Licenses
### AngularJS
> Copyright (C) 2010-2015 Google, Inc. http://angularjs.org
>
> License: MIT

### angular-moment
> Copyright (C) 2013-2015 Uri Shaked and contributors
>
> License: MIT

### identicon.js
> Copyright (C) 2013 Stewart Lord
>
> License: BSD

### jQuery
> Copyright (C) 2005-2015 jQuery Foundation, Inc.
>
> License: MIT

### PNGLib
> Copyright (C) 2010 Robert Eisele
>
> License: BSD

### angular-scroll-glue
> Copyright (C) 2013 Luegg
>
> License: MIT

### node_modules
For other modules, see the respective LICENSE files in the node_modules
directory.
