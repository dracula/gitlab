### [GitLab](http://gitlab.com/explore)

Currently, this theme will only update the syntax highlighting for code and diffs. WebIDE and single
file editor continue to use the theme set in the personal preferences. Does not work on the diff
example in the profile preferences due to a different implementation.

The theme bases on GitLab
version [`v15.1.2`](https://gitlab.com/gitlab-org/gitlab-foss/-/tags/v15.1.2).

#### Install with browser extension

- Install Stylus
  for [Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne),
  [Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/) or
  [Opera](https://addons.opera.com/en-gb/extensions/details/stylus/)

- [Click here to install Dracula for GitLab](https://github.com/dracula/gitlab/raw/master/dracula.user.css)

- Once installed, it will replace all syntax highlighting themes with Dracula. If the Dracula theme
  does not apply e.g. in WebIDE or single file editor, the chosen theme from the personal
  preferences will be used.

#### Install manually

You can find a link to the css that you'll need to manually inject here:

```
https://github.com/dracula/gitlab/raw/master/dracula.css
```

#### Compile manually

Make sure Node.js 16+ is installed.

```shell
git clone https://github.com/dracula/gitlab dracula-gitlab
cd dracula-gitlab/build

npm install
npm run build
```

Then you'll find `dracula.css` and `dracula.user.css` in the root folder.
