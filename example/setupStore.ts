import { readFile, writeFile } from "fs"
import {setupStore, memoryStore, SECRET_KEY, SECRET_VALUE, env, allEnv} from "../src"
import path from "path"

memoryStore.getSecrets = async () => {
    return new Promise((resolve, reject) => {
        // Dynamically fetch secrets from a remote resource
        readFile(path.resolve(__dirname,"./secrets.json"), (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            resolve(JSON.parse(data.toString()))
        })
    })
}
memoryStore.setSecret = async (key: SECRET_KEY, value: SECRET_VALUE) => {
    // Make an api call to update the secret
    const secrets = allEnv()
    secrets[key] = value
    writeFile(path.resolve(__dirname,"./secrets.json"), JSON.stringify(secrets, null, '\t'), (err) => {
        if (err) {
            console.log(err)
            return
        }
    })
}


(async function () {
    await setupStore(memoryStore)
})()