const fetch = require("node-fetch");
const sass = require("node-sass");
const fs = require("fs");

// The release tag from gitlab to download scss files from
const gitlab_release_tag = "v15.1.2";
const userStyleComment = `/* ==UserStyle==
@name         Dracula for GitLab
@description  A dark theme for GitLab
@namespace    github.com/dracula/gitlab
@version      2.0.0
@homepageURL  https://draculatheme.com/gitlab
@supportURL   https://github.com/dracula/gitlab/issues
@updateURL    https://github.com/dracula/gitlab/raw/master/dracula.user.css
@license      MIT
@preprocessor stylus
==/UserStyle== */
`;

/**
 * Download a file from provided URL.
 * @param url to fetch and save locally.
 * @returns {Promise<*>} resolving to the file content.
 */
async function download(url) {
  const res = await fetch(url);
  let text = await res.text();
  return text.replace(/@import [^]*?;/gi, "");
}

(async () => {
  // Download scss files for variables and mixins
  const gitlabVariables = await download(
      `https://gitlab.com/gitlab-org/gitlab-foss/-/raw/${gitlab_release_tag}/app/assets/stylesheets/framework/variables.scss`
  );
  const gitlabCommon = await download(
      `https://gitlab.com/gitlab-org/gitlab-foss/-/raw/${gitlab_release_tag}/app/assets/stylesheets/highlight/common.scss`
  );
  const draculaTheme = fs.readFileSync("highlight-dracula.scss", "utf8");
  const monacoDraculaTheme = fs.readFileSync("monaco-editor.scss", "utf8");
  let draculaHighlightJs = await download(
      "https://github.com/dracula/highlightjs/raw/7e046d97407ba14b3f812b4c23cfc4bd921edc3e/dracula.css"
  );
  draculaHighlightJs = draculaHighlightJs.replaceAll(
      ".hljs", ".code.highlight .hljs"
  );

  const scss = `
    ${gitlabVariables}
    ${gitlabCommon}
    ${draculaTheme}
    ${monacoDraculaTheme}
    ${draculaHighlightJs}
  `;

  sass.render(
      {
        outputStyle: "compressed",
        data: scss
      },
      (err, result) => {
        if (err) {
          return console.error(err);
        }

        let css = result.css.toString().trim();

        fs.writeFileSync("../dracula.css", css);
        fs.writeFileSync(
            "../dracula.user.css",
            userStyleComment +
            '@-moz-document domain("gitlab.com"){' + css + "}"
        );
      }
  );
})();
