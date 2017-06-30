# chord-gen
A chord progression generator with AI input

Backend is an express server which will use the Node SDK for IBM Watson Tone Analyzer, and the API from Hooktheory

Front end is using create-react-app

I barely know how this works together

It includes a proxy

Whatever that is

## Usage

Clone/download, and run `npm install` in both the root and /client folder
You can navigate to /api and run `node test.js` and make sure everything works

Then run `npm start` in the root folder (or `npm run server` and `npm run client` in seperate prompts to see console for server).

The browser should pop up with localhost:3000, and you should be able to send a prompt to the server and it will return a progression.

Press the play button to hear the progression (it may sound messy as every note is in one octave).

## Limitations

Right now everything is using my accounts for IBM and hooktheory

There are limits to 2500 calls to watson/month, and hook theory limits to 10/10 seconds. 

## Help out

Eventually I'll set up some issues (mainly refactoring and making my code prettier and easier to read and less terrible overall).
