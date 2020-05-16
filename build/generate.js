const fetch = require("node-fetch");
const sass = require("node-sass");
const fs = require("fs");

const userStyleComment = `/* ==UserStyle==
@name         Dracula for GitLab
@description  A dark theme for GitLab
@namespace    github.com/dracula/gitlab
@version      1.0.0
@homepageURL  https://draculatheme.com/gitlab
@supportURL   https://github.com/dracula/gitlab/issues
@license      MIT
@preprocessor stylus
==/UserStyle== */
`;

async function download(url, removeImports) {
	const res = await fetch(url);
	let text = await res.text();

	if (removeImports) text = text.replace(/@import [^]*?;/gi, "");

	return text;
}

(async () => {
	// https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/app/assets/stylesheets/highlight/themes/monokai.scss
	// https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/app/assets/stylesheets/pages/merge_conflicts.scss
	// https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/app/assets/javascripts/ide/lib/themes/monokai.js

	const frameworkVariables = await download(
		"https://gitlab.com/gitlab-org/gitlab-foss/-/raw/master/app/assets/stylesheets/framework/variables.scss",
		true,
	);
	const highlightCommon = await download(
		"https://gitlab.com/gitlab-org/gitlab-foss/-/raw/master/app/assets/stylesheets/highlight/common.scss",
		true,
	);
	const highlightDracula = fs.readFileSync("highlight-dracula.scss", "utf8");

	const scss = `
		${frameworkVariables}
		${highlightCommon}
		${highlightDracula}
		
		body {
			.syntax-theme label:nth-child(1) {
				.preview {
					height: 100px;
					border-radius: 4px;
					background-image: url(https://draculatheme.com/static/img/screenshots/pygments.png);
					background-size: 300%;
					img {
						display: none;
					}
				}

				word-spacing: -999px;
				letter-spacing: -999px;
				&:after {
					content: "Dracula";
					margin-left: 4px;
					word-spacing: normal;
					letter-spacing: normal;
				}
			}
		}
	`;

	sass.render(
		{
			outputStyle: "compressed",
			data: scss,
		},
		(err, result) => {
			if (err) return console.log(err);

			const css = result.css.toString().trim();
			fs.writeFileSync("../dracula.css", css);

			fs.writeFileSync(
				"../dracula.user.css",
				userStyleComment +
					'@-moz-document domain("gitlab.com"){' +
					css +
					"}",
			);
		},
	);
})();
