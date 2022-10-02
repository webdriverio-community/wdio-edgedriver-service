module.exports = class EdgeService {
    private instance?: any

    constructor(options: any) {
        this.instance = import('../service.js').then((EdgedriverLauncher) => {
            return new EdgedriverLauncher.default(options)
        })
    }

    async beforeSession (config: any, capabilities: any, ___: never, cid: string) {
        const instance = await this.instance
        return instance.beforeSession(config, capabilities, cid)
    }

    async afterSession () {
        const instance = await this.instance
        return instance.afterSession()
    }
}
