import { setupStore, SecretStore, Env } from "../src";
import axios from "axios";

const remoteStore: SecretStore<Env> = {
  async getSecrets() {
    const res = axios.get("https://path-to-kv.com");
    return res.data;
  },
  async setSecret() {},
};

(async function () {
  await setupStore(remoteStore);
})();
