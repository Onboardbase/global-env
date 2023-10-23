import { setupStore, SecretStore, Env } from "../src";
import axios from "axios";

const remoteStore: SecretStore<Env> = {
  async getSecrets() {
    const res = await axios.get<Env>("https://jsonplaceholder.typicode.com/todos/1");
    return res.data;
  },
  async setSecret() {},
};

(async function () {
  await setupStore(remoteStore);
})();
