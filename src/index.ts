import { getEnv } from "./env"

export interface SecretStore<P> {
    getSecrets: () => Promise<P>
    setSecret: (key: SECRET_KEY, val: SECRET_VALUE) => Promise<void>
}

export type Env = Record<SECRET_KEY, SECRET_VALUE>
export type SECRET_KEY = string
export type SECRET_VALUE = string|number|boolean|undefined

export class GlobalEnv<T extends Env> {
    secrets: Env;
    constructor (private store: SecretStore<T>) {
        this.secrets = Object.assign({} , getEnv)
    }

    async init(store: SecretStore<T>) {
        this.store = store
        await this.populateCache()
    }

    private async populateCache () {
        try {
            // populates the secrets field using the value returned by the secret store
            const secrets = await this.store.getSecrets()
            this.secrets = Object.assign(getEnv, secrets)
        } catch (error) {
            console.error(error)
            throw new Error("Failed to initialize secret store: attempted to call get secrets on the store but failed")
        }
    }


    get(key?: SECRET_KEY) {
        return key ? this.secrets[key] : Object.assign({}, this.secrets)
    }

    async set(key: SECRET_KEY, value: SECRET_VALUE) {
        const secrets = this.secrets as {[key: SECRET_KEY]: SECRET_VALUE}
        secrets[key] = value
        await this.store.setSecret(key, value)
    }
}

const IN_MEMORY_STORE: Env = Object.assign({} )

export const memoryStore: SecretStore<Env> = {
    async getSecrets () {
        return new Promise((resolve, reject) => {
            resolve(IN_MEMORY_STORE)
        })
    },
    async setSecret(key: SECRET_KEY, value: SECRET_VALUE) {
        IN_MEMORY_STORE[key] = value
    }
}

export const gs = new GlobalEnv(memoryStore)
export const setupStore = async (store: SecretStore<Env>) => {
    await gs.init(store)
}

export const env = gs.get.bind(gs)

export const allEnv = env as () => Env

export const setEnv = gs.set.bind(gs)