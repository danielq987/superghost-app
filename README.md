# superghost-app

Superghost is a web application that allows users to play against their friends in this classic word game. Players can create rooms and invite other people by sharing the given room codes. Once "Start Game" is clicked, no new players can be added to the room. Players also have the option of playing against what is currently believed to be an unbeatable AI. 

A demo is available at the link below — some features are still not functional as the game is a work in progress. 

[Demo] https://agile-crag-17897.herokuapp.com/

## Inspiration

This game was first taught to us while we were in elementary school and we've continued to play it throughout the years. With the pandemic, the traditional method of playing (on paper) was no longer a feasible option. Inspired by other online games such as Skribbl.io, we decided to build a program that would enable us and other people to enjoy this fun game in a socially distant manner! 

## Rules of the game 

* Players take turns adding letters to the beginning or end of a growing word fragment; the fragment must be part of a valid word
* The goal of the game is to not be the one to complete a valid word
* Players can challenge whether the current fragment is part of a word or check if the current fragment is already a word 

## How we built it

* React, HTML, Pug on the frontend 
* Javascript (Node, Express), Python, SQL for backend

## What's next for Superghost 

* Polish and improve user interface
* Enforce turn restriction 
* Develop point tallying system
* Restrict user input (no special characters) 
* Expand languages 
