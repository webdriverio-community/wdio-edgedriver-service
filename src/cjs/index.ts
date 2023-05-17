module.exports = class EdgeService {
    private instance?: any

    constructor(options: any, caps: never, config: any) {
        this.instance = import('../service.js').then((EdgedriverLauncher) => {
            return new EdgedriverLauncher.default(options, caps, config)
        })
    }

    async beforeSession (config: unknown, capabilities: unknown, ___: never, cid: string) {
        const instance = await this.instance
        return instance.beforeSession(config, capabilities, cid)
    }

    async afterSession () {
        const instance = await this.instance
        return instance.afterSession()
    }
}
