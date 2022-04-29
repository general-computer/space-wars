# react-boilerplate

Created to save my time on setting up React and the libraries I use the most. It includes:
- All dependencies and files created by `create-react-app` and have all demo files removed
- Redux (`react-redux` and Redux Toolkit) with a pre-configured store
- Github Pages (`gh-pages` as `devDependencies`)
- [Styled components](https://github.com/styled-components)
- [Normalized.css](https://github.com/necolas/normalize.css/)

## How to use:
1. In the repo's main page, click "Code" -> "Download as ZIP"
2. Unzip the folder and rename it to whatever you like, then go to Bash and `cd` into the folder, run:
```
npm install
```
- ✅ All done!

### To link it to your GitHub repo:

- create an empty repo in your GitHub, then in the folder's root, run:
```
git init
git remote add origin git@github.com:GITHUB_AC_NAME/GITHUB_REPO_NAME.git
git add .
git commit -m "Initial commit"
git push -u origin main
```
### To use Github Pages:
1. Go to `package.json` and change `"homepage": "https://noktnl.github.io/react-boilerplate"` to your GitHub Pages link as shown in your repo
2. In the folder's root, run:
```
npm run deploy
```
