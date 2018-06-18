export default {
  auth: undefined,

  load() {
    if (this.isLoaded()) return Promise.resolve()

    return new Promise(resolve => {
      window.handleGoogleApi = () => resolve()
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/client.js?onload=handleGoogleApi'
      document.body.appendChild(script)
    })
  },

  isLoaded() {
    return window.gapi && gapi.auth && typeof gapi.auth.getToken === 'function'
  },

  isSignedIn() {
    if (!this.auth) throw new Error('You must call authorize() first');
    return this.auth.isSignedIn.get();
  },

  signIn() {
    return this.auth.signIn();
  },

  loadClient() {
    return new Promise(resolve => {
      return gapi.client.load('tasks', 'v1', function () {
        return gapi.client.load('plus', 'v1', function () {
          return resolve();
        });
      });
    });
  },

  async authorize(clientId, uxMode = 'redirect', redirectUri = undefined) {
    await this.load();

    if (!redirectUri) redirectUri = window.location.href;

    this.auth = await gapi.auth2.init({
      client_id: clientId,
      ux_mode: uxMode,
      redirect_uri: redirectUri,
      scope: 'https://www.googleapis.com/auth/tasks',
      cookie_policy: 'single_host_origin',
    });
  },

  async logout() {
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

  async listTaskLists() {
    await this.load()

    return (await this.makeRequest(gapi.client.tasks.tasklists.list())).items
  },

  async insertTaskList({ title }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.insert({
      title
    }))
  },

  async updateTaskList({ taskListId, title }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.update({
      tasklist: taskListId,
      id: taskListId,
      title
    }))
  },

  async deleteTaskList({ taskListId }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasklists.delete({
      tasklist: taskListId
    }))
  },

  async listTasks(taskListId) {
    await this.load()

    return (await this.makeRequest(gapi.client.tasks.tasks.list({
      tasklist: taskListId
    }))).items
  },

  async insertTask({ taskListId, ...params }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      ...params
    }))
  },

  async updateTask({ taskListId, taskId, ...params }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.update({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
      ...params
    }))
  },

  async deleteTask({ taskListId, taskId }) {
    await this.load()

    return this.makeRequest(gapi.client.tasks.tasks.delete({
      tasklist: taskListId,
      task: taskId,
      id: taskId
    }))
  },

  async makeRequest(requestObj) {
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
