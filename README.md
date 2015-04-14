# shoot-it
Shooting gallery for tons of fun! Use your smart device and fire away!

## To Run
First install packages listed in package.json (you'll need node). From the root directory:

`npm install`

Then run the start script to get the system running locally

`npm start`

Other devices can then connect to that machines local ip address, like below:

123.456.0.111**:3000/control**

Files and Folders
## ./control
A folder containing all the logic for the smart devices
### ./control/config.html
This contains the wizard for people to config their devices 
### ./control/flipsnap.js
Library for scrolling through colors (http://hokaccha.github.io/js-flipsnap/demo.html)
### ./index.html
The html for the page when playing the game
### ./index.js
The javascript for the page when playing the game
### ./main.css
The css for the config and main page
## ./host
todo
A folder containing all the logic and files for the application

