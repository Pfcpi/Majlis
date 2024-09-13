# pfcpi

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# Electron-vite

## Prerequisites: 
- make sure that node and npm are installed by running the following commands

```Bash
node -v
npm -v
```

NOTE: install them if they are not installed.

## Create the Setup

To create a setup for our electron application use the following:

```Bash
npm create @quick-start/electron@latest
```
- Set as follwing:
1. project name: pfcpi.
2. choose react.
3. select NO.
4. select NO.
5. select NO.

Enter your app directory
```Bash
cd electron-app
```

install the required dependencies using this command
```Bash
npm install
```

try your app
```Bash
npm run dev
```

Build your app for windows!
- NOTE: make sure to run VSCODE as an administrator

```Bash
npm run build:win
```
Please note that you should change the email accounts/SMPTP in the backend files for mailing services.

🎉 :tada: Congratulations
