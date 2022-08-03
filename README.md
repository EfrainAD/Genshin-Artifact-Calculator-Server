# Genshin Impact Artifact Rater
A helper app for the popular video game Genshin Impact. An important part of Genshin's endgame is farming for "artifacts", which can be powered up to semi-randomly increase their stats. Having artifacts that roll the proper stats can be extremely helpful for a player, but since there are several layers of randomness, it can sometimes be difficult to tell exactly how good one artifact is compared to another.

The Artifact Rater aims to make it easier to compare different artifacts by allowing users to upload screenshots of their artifacts and assigning each uploaded artifact two ratings: a percentile rating describing how good the artifact is compared to all possible other artifacts of the same type, and a relative power rating describing how good the artifact is compared to the best possible artifact of that type.

## Planning
### User Stories
As a user, I would like to:
- upload a screenshot of an artifact to the server for analysis
  - have the server read the artifact's stats from the screenshot
  - receive a percentile rating for my uploaded artifact
  - receive a relative power rating for my uploaded artifact
- be able to create an account and log in to save uploaded artifacts
- have the option, after uploading and analysis, to save the uploaded artifact to my account
- be able to view all of my saved artifacts
- be able to "favorite" saved artifacts
- be able to delete saved artifacts
- sort the artifacts I've saved by several different filters:
  - artifact's set
  - specified main stat
  - specified substat
  - percentile rating
  - power rating
  - favorite
- have a one-click feature that, drawing from all the artifacts I own, finds the best artifact combination for a specified character (stretch goal)

### Wireframes

![](/wireframes/1.jpeg)
![](/wireframes/2.jpeg)
![](/wireframes/3.jpeg)
![](/wireframes/4.jpeg)
![](/wireframes/5.jpeg)
![](/wireframes/6.jpeg)
![](/wireframes/7.jpeg)
![](/wireframes/8.jpeg)

### Roles
- Manager: Tyson
- Front-End SME: Efrain
- Back-End SME: Fei