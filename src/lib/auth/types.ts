
export type AuthFlowAction = 'registration' | 'login' | 'logout' | 'google'

export type AuthFlowData = { csrfCookie: string, flowId: string }
