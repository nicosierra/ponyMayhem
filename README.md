# Pony Challenge

## Description
The following code fetches data from the Pony Challenge Api in order to help its ponies to reach their destiny Ponyville.

### Technical aspects
- I run a DFS from the Pony's position to its goal, in order to find its shortest path to reach home.
- I am not taking into consideration the Domokun, so the Pony is on savage mode. A reason was that quite often when the Domokun is on the path that leads to the goal, the algorithm can't find other paths. Perhaps, just by trying to stay away from the Domokun, would make it go in another direction that could open a new path. (To Check)
- There are tests for the DFS and its helpers.

### Improvements
- Perform a DFS from the Pony to the Domokun and use a "retreat" and/or "stay away" strategy.
- Implement an A* algorithm, using an arbitrary function to increase the cost of the nodes near the Domokun.
- Display the hidden image once the game is over (I pushed a branch that does that, only compatible with iterm).

## Getting started
You can run the code directly, or via docker

### Prerequisites
- Docker, OR
- Node > 9

### Running it directly on your machine
```
node src/index.js
```

### Running it via Docker
First, build the image (execute only once)
```
docker-compose build
```
Run it with:
```
docker-compose run pony
```

### Options
To get information on the available arguments and default values, run the command with the `--help` option.

