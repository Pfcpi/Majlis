import { MSICreator } from 'electron-wix-msi';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: 'D:/Download/Dev/Electron/test 1 pitié marche/dist/win-unpacked/app1.exe',
  description: 'help please',
  exe: 'App installer',
  name: 'First application test',
  manufacturer: 'le pire dev qui a existé',
  version: '1.1.2',
  language: 1033,
  outputDirectory: 'D:/Download/Dev/Electron/test 1 pitié marche/bin/',
  ui: {
    chooseDirectory: true
  }
});


async function createMsi() {
    await msiCreator.create();
    await msiCreator.compile();
  }
  
  createMsi();
  