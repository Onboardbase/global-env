<div align=“center”>

# Global ENV

Dynamically evaluate environment variables at runtime.

This library assumes that environment variables are best stored remotely in a secure vault and attempts to load the secrets during initialization.

</div>

## Motivation

Secrets can be statically analyzed in a node application through process.env, which exports all the key/value pairs of the current environment variables as static objects and can be inspected through the built files.

To mitigate the risk of spreading secrets unintentionally, this library attempts to take secrets as dynamic values that could be pulled from a remote resource and be kept in memory for the entire runtime of the application.



## Install

To use `global-env`,
## yarn

```bash
yarn add @onboardbase/global-env ```
 
## npm
 ```bash
 npm i @onboardbase/global-env```

## Usage

### Using with in-memory varibalbe source

Create a file called `setupGlobalEnv.ts` and add the below content. 

```js
import { setupStore, memoryStore, SECRET_KEY, SECRET_VALUE, env, allEnv } from "@onboardbase/global-env"

const MEMORY_SECRETS = {
    RECORD_LABEL: "IMOLENIZATION",
    SECRET_KEY: "MOHBAD"
}

memoryStore.getSecrets = async () => {
    return new Promise((resolve, reject) => {
        // Dynamically fetch secrets from a remote resource
        resolve(MEMORY_SECRETS)
    })
}
memoryStore.setSecret = async (key: SECRET_KEY, value: SECRET_VALUE) => {
    // Make an API call to update the secret
    const secrets = allEnv()
    secrets[key] = value
    console.log("Secret Updated on Remote", secrets)
}


(async function () {
    await setupStore(memoryStore)
})()
```

Import this file at the top of the root file of your project.
```js
import "./setupGlobalEnv"
```

Finally, anywhere else:
```js
import {env} from "@onboardbase/global-env"

console.log(env()) // logs all the secrets set during initialization
console.log(env("SECRET_KEY")) // => "MOHBAD"
```
Find an example here: https://github.com/Onboardbase/global-env/tree/main/example

### Using with a Remote source
If you want to fetch the environment variables from a remote source instead, you will have to setup global env like this:
```js
import {
  setupStore,
  memoryStore,
  SECRET_KEY,
  SECRET_VALUE,
  env,
  allEnv,
} from '@onboardbase/global-env'; 

import axios from 'axios';

const fetchSecrets = async () => {
  const response = await axios.get(
    '<remote-url>',
  );
  return response.data;
};

memoryStore.getSecrets = fetchSecrets;
memoryStore.setSecret = async (key: SECRET_KEY, value: SECRET_VALUE) => {
  // Make an API call to update the secret
  const secrets = allEnv();
  secrets[key] = value;
  console.log('Secret Updated on Remote', secrets);
};

(async function () {
  await setupStore(memoryStore);
})();

```
You can then access the secrets say in your Express Server like this:
```js
import './setupGlobalEnv';
import express from 'express';
import { env } from '@onboardbase/global-env';
const app = express();

app.get('/secrets', async (req, res) => {
  console.log(env()); // logs the variables here
  res.send({success: true});
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
```
## API

#### **`exports.set(key: string, value: string): void`**

It can be used to update the value of an env or create a new one. It attempts first to update the in-memory copy of the secrets and then calls the remote resource to complete the update on the upstream.

#### **`exports.env(key?): string | Record<string, any>`**
Get the value of an env by passing the key into the function. If no key is passed, it loads all the key/value pairs of the env.

#### **`exports.allEnv(): Record<string, any>`**
Loads all the key/value pairs of the env.


## CONTRIBUTORS

Contributors are welcome. Read the guide at [`CONTRIBUTING.MD`](./CONTRIBUTING.MD).


### Credits

🙌  Inspired by: [std-env](https://github.com/unjs/std-env)


