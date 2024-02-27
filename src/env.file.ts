import { resolve } from "path"
import { readFileSync } from "fs"
import { Env } from "."

export function configEnv() {
  const dotEnvPath = resolve(process.cwd(), '.env')
  const dotenvData = readFileSync(dotEnvPath, 'utf-8')
  
  return parseDotEnv(dotenvData)
}

function parseDotEnv(data: string){
  let envs:Env = {}
  const secrets = data.split('\n')
  secrets.forEach(secret=>{
    if(secret.includes('=')){
      const [key,value] = secret.split('=')
      envs[key] = value.includes('\'') || value.includes('"') ? value.substring(1,value.length-1) : value
    }
  })
  return envs
}