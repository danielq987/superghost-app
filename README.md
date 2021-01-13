# superghost-app

Superghost is a web application that allows users to play against their friends in this classic word game. Players can create rooms and invite other people by sharing the given room codes. Once "Start Game" is clicked, no new players can be added to the room. Players also have the option of playing against what is currently believed to be an unbeatable AI. 

## Inspiration

This game was first taught to us while we were in elementary school and we've continued to play it throughout the years. With the pandemic, the traditional method of playing (on paper) was no longer a feasible option. Inspired by other online games such as Skribbl.io, we decided to build a program that would enable us and other people to enjoy this fun game in a socially distant manner! 

## Rules of the game 

* Players take turns adding letters to the beginning or end of a growing word fragment; the fragment must be part of a valid word
* The goal of the game is to not be the one to complete a valid word
* Players can challenge whether the current fragment is part of a word or check if the current fragment is already a word 

## How we built it

* React, HTML, Pug on the frontend 
* Javascript (Node, Express), Python, PostgreSQL for backend

## What's next for Superghost 

* Polish and improve user interface
* Enforce turn restriction 
* Develop point tallying system
* Restrict user input (no special characters) 
* Expand languages 

## See it in action!

A demo is available [here](https://agile-crag-17897.herokuapp.com/)- some features are still not functional as the game is a work in progress. You can also see these GIFS:


Create a room           |  Join a room
:-------------------------:|:-------------------------:
![create a room](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/1-create-room.gif)  |  ![join a room](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/2-join-room.gif)

### Start a game
![start game](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/3-start-game.gif)

### Chat function
![chat function](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/4-chat-function.gif)

### Adding words
![adding words](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/5-word-adding.gif)

### Reset words
![reset words](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/6-reset-word.gif)

### Check words
![check words](https://github.com/danielq987/superghost-app/blob/a2f89aad90d98cb1b7272dc9d69ba9bf803c8a94/public/img/superghost-gifs/7-word-check.gif)



