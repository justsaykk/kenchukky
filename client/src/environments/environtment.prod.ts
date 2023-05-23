import { defaultEnvironment  } from "./environment.default";

export const environment = {
    ...defaultEnvironment,
    production: true,
    BACKEND: 'https://kenchukky-server.up.railway.app'
}