describe('api', () => {
    it('should recognize window.googleTasksApi', async () => {
        if (!window.googleTasksApi) {
            throw new Error('window.googleTasksApi does not exsit')
        }
    })
})