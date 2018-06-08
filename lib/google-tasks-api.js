export default {
  load () {
    if (this.isLoaded()) return Promise.resolve()

    return new Promise(resolve => {
      window.handleGoogleApi = () => resolve()
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/client.js?onload=handleGoogleApi'
      document.body.appendChild(script)
    })
  },

  isLoaded () {
    return window.gapi && gapi.auth && typeof gapi.auth.getToken === 'function'
  },

  async authorize (clientId, isImmediate) {
    await this.load()

    const autoImmediate = isImmediate === undefined
    if (autoImmediate) isImmediate = true

    return new Promise((resolve, reject) => {
      gapi.auth.authorize(
        {
          'client_id': clientId,
          'scope': ['https://www.googleapis.com/auth/tasks'],
          'immediate': isImmediate,
          'cookie_policy': 'single_host_origin'
        },
        authResult => {
          if (authResult.error) {
            if (authResult === 'immediate_failed' && autoImmediate) {
              return this.authorize(clientId, false).then(resolve).catch(reject)
            } else {
              return reject(authResult.error)
            }
          }
          return gapi.client.load('tasks', 'v1', () => gapi.client.load('plus', 'v1', () => resolve()))
        }
      )
    })
  },

  async logout () {
    await this.load()

    return new Promise((resolve, reject) => {
      const token = gapi.auth.getToken()

      if (token) {
        const accessToken = gapi.auth.getToken().access_token

        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`, {
          mode: 'no-cors'
        })
          .then((res) => {
            gapi.auth.signOut()
            resolve()
          })
          .catch((error) => reject(error))
      }
    })
  },

  async listTaskLists () {
    await this.load()

    return (await this.makeRequest(gapi.client.tasks.tasklists.list())).items
  },

  async insertTaskList ({ title }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.insert({
      title
    }))
  },

  async updateTaskList ({ taskListId, title }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.update({
      tasklist: taskListId,
      id: taskListId,
      title
    }))
  },

  async deleteTaskList ({ taskListId }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.delete({
      tasklist: taskListId
    }))
  },

  async listTasks (taskListId) {
    await this.load()

    return (await this.makeRequest(gapi.client.tasks.tasks.list({
      tasklist: taskListId
    }))).items
  },

  async insertTask ({ taskListId, ...params }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      ...params
    }))
  },

  async updateTask ({ taskListId, taskId, ...params }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.update({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
      ...params
    }))
  },

  async deleteTask ({ taskListId, taskId }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.delete({
      tasklist: taskListId,
      task: taskId,
      id: taskId
    }))
  },

  async makeRequest (requestObj) {
    await this.load()

    return new Promise((resolve, reject) => {
      requestObj.execute(resp =>
        resp.error
          ? reject(resp.error)
          : resolve(resp.result)
      )
    })
  }
}
