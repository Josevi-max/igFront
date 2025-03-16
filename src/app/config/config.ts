// src/app/config/config.ts
import { environment } from "../../environments/environment";

export const config = {
  api: {
    URL_BACKEND: environment.URL_BACKEND,
    URL_BACKEND_BASE: environment.URL_BACKEND_BASE,
  },
  pusher: {
    key: environment.API_KEY_PUSHER,
    cluster: environment.CLUSTER_PUSHER
  }
}