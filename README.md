[![Known Vulnerabilities](https://snyk.io/test/github/bluzi/google-tasks-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/bluzi/google-tasks-api?targetFile=package.json) [![Build Status](https://travis-ci.org/bluzi/google-tasks-api.svg?branch=master)](https://travis-ci.org/bluzi/google-tasks-api)
# Google Tasks API
## What is it good for?
Google made their API so hard to understand, so after struggling with their documentation for their Tasks API I've found [this repository](https://github.com/KarafiziArtur/react-google-tasks) that has a well written abstraction around the Tasks API.

This package contains the code from the above repository with some additions I made to make it easy to embed in your web application.

## Install
If you're using Node:
```bash
npm i google-tasks-api
```

Or, if you're using plain JavaScript, just add the following script tag: 
```html
<script src="https://cdn.jsdelivr.net/npm/google-tasks-api@latest/dist/index.min.js"></script>
```

## Google API Credentials
You must have a client ID to use Google Tasks API, to get one, go to [Google APIs Console](https://console.developers.google.com/apis/dashboard) and create a new project, then go to `Credentials` and click on `Create credentials`. 
Choose `OAuth client ID`, then under application type choose `Other`, press `Create` and copy the client ID. 

## Usage
If you're on Node, import the API using: (You can skip that if you're not using Node)
```js
import googleTasksApi from 'google-tasks-api'`
```
or 
```js
const googleTasksApi = require('google-tasks-api')
```

Now you can start using the API. Start by autorizing: 
```js
await googleTasksAPI.autorize('yourclientid')
```

That will promote a popup to the user asking him for permission, after he accepts, the promise will resolve and you will be able to use the following self-explaining methods:

| Method        | Return Type   | Description  |
| ------------- |:-------------:| -----        |
| `listTaskLists()`    | `Promise<[]>`     | Returns a list of task lists |
| `insertTaskList({ title })`    | `Promise<>`     | Receives an object with a `title`, and creates a new task list |
| `updateTaskList({ taskListId, title })`    | `Promise<>`     | Receives an object with a `taskListId` to update and a `title`, and updates the task list title |
| `deleteTaskList({ taskListId })`    | `Promise<>`     | Deletes a task list|
| `listTasks({ taskListId })`    | `Promise<[]>`     | Lists the tasks of `taskListId`|
| `insertTask({ taskListId, ...params })`    | `Promise<>`     | Creates a task in `taskListId`, a task may have [the following fields](https://developers.google.com/tasks/v1/reference/tasks)|
| `updateTask({ taskListId, taskId, ...params })`    | `Promise<>`     | Updates a task by its id and task list id|
| `deleteTask({ taskListId, taskId })`    | `Promise<>`     | Deletes task `taskId` in list `taskListId`|

## Contribution
Any type of feedback, pull request or issue is welcome.

## License
This project is licensed under the MIT License
