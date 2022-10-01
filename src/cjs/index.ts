exports.default = class EdgeService {}
exports.launcher = class CJSEdgedriverLauncher {
    private instance?: any

    constructor(options: any, capabilities: any, config: any) {
        this.instance = import('../launcher.js').then((EdgedriverLauncher) => {
            return new EdgedriverLauncher.default(options, capabilities, config)
        })
    }

    async onPrepare () {
        const instance = await this.instance
        return instance.onPrepare()
    }

    async onComplete () {
        const instance = await this.instance
        return instance.onComplete()
    }
}
