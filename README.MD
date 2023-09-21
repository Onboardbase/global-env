
# Global ENV

Dynamically evaluate environment variables at runtime.

This module assumes that environment variable are best stored remotely in a secure vault. And attempts to load the secrets during initialization.

### Motivation
Secrets can be statically analyzed in a node application through process.env, which exports all the key/value pairs of the current environment variables as static objected and could be inspected through the built files.

To mitigate the risk of spreading secrets unintentionally, this project attempts to take secrets as dynamic values that could be pulled from a remote resource, and be kept in memory for the entire runtime of the application.


### Example

Install the dependencies
```sh 
yarn install
```

Then run 
```sh
yarn dev
```

### Setup
Install the package from npm or yarn
```bash
yarn add global-env
# or
npm install global-env
```

Create a file called `setupGlobalEnv.ts` and add the below content 

```js
import { setupStore, memoryStore, SECRET_KEY, SECRET_VALUE, env, allEnv } from "../src"

const MEMORY_SECRETS = {
    RECORD_LABEL = "IMOLENIZATION",
    SECRET_KEY = "MOHBAD"
}

memoryStore.getSecrets = async () => {
    return new Promise((resolve, reject) => {
        // Dynamically fetch secrets from a remote resource
        resolve(MEMORY_SECRETS)
    })
}
memoryStore.setSecret = async (key: SECRET_KEY, value: SECRET_VALUE) => {
    // Make an api call to update the secret
    const secrets = allEnv()
    secrets[key] = value
    console.log("Secret Updated on Remote", secrets)
}


(async function () {
    await setupStore(memoryStore)
})()
```

and import this file at the top of the root file of your project
```js
import "./setupGlobalEnv"
```

Finally, anywhere else:
```js
import {env} from "global-env"

console.log(env()) // logs all the secrets set during initialization
console.log(env("SECRET_KEY")) // => "MOHBAD"
```

### API

#### **`exports.set(key: string, value: string): void`**

Can be used to update the value of an env or create a new one. It attempts to first update the in-memory copy of the secrets then make a call to the remote resource to complete the update on the upstream.

#### **`exports.env(key?): string | Record<string, any>`**
Get the value of an env by passing the key into the function, if no key is passed, it loads all the key/value pairs of the env.

#### **`exports.allEnv(): Record<string, any>`**
Loads all the key/value pairs of the env.


### CONTRIBUTORS
Contributors are welcome, do ensure to read the guide at [`CONTRIBUTING.MD`](./CONTRIBUTING.MD).


### Credits

🙌  Motivated by: [std-env](https://github.com/unjs/std-env)

👨‍💻  Created by: [Aleem Isiaka](https://github.com/limistah)

🌍  From [Onboardbase](https://github.com/onboardbase)


