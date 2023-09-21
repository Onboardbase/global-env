import "./setupStore"
import {env, setEnv} from '../src'

setTimeout(() => {
    console.log("ONBOARDBASE_PROJECT", env("ONBOARDBASE_PROJECT"));
    console.log("ONBOARDBASE_TOKEN", env("ONBOARDBASE_TOKEN"))
    setEnv("ONBOARDBASE_PROJECT", "IMOLENIZATION")
    console.log("ONBOARDBASE_PROJECT", env("ONBOARDBASE_PROJECT"));
    console.log(env())
}, 2000)
