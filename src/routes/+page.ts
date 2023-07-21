import { requestInitialFlowData } from "../lib/auth/frontend/auth"

export async function load() {
    return await requestInitialFlowData('login')
}
