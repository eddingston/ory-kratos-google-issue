import type { AuthFlowAction, AuthFlowData } from "../types";

export async function initializeAuthFlow(action: AuthFlowAction): Promise<AuthFlowData> {
    const response = await fetch(`http://edd-test.com:4433/self-service/${action}/browser`, {
        credentials: 'include',
        redirect: 'manual'
    });
    const flowId = await extractFlowId(response)
    const csrfCookie = await extractCsrfCookie(response)
    return { csrfCookie, flowId };
}

async function extractFlowId(response: Response): Promise<string> {
    const responseBody = await response.text();
    const flowIdPattern = /flow=([\w-]+)/;
    const match = responseBody.match(flowIdPattern);
    const flowId = match ? match[1] : undefined;
    if (!flowId) throw new Error('Unable to find flow id when initializing auth flow.');
    return flowId
}

async function extractCsrfCookie(response: Response): Promise<string> {
    const cookies = response.headers.get('set-cookie');

    if (cookies) {
        const csrfTokenPattern = /csrf_token_[^;]*/;
        const match = cookies.match(csrfTokenPattern);

        if (match) {
            const csrfTokenCookie = match[0];
            return csrfTokenCookie;
        }
    }
    throw new Error('No csrf_token cookie in the response.');
}

export async function requestAuthFlowFormData(action: AuthFlowAction, flowData: AuthFlowData) {
    const url = new URL(`http://edd-test.com:4433/self-service/${action}/flows?id=${flowData.flowId}`);
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Cookie': flowData.csrfCookie
        }
    });

    const data = await response.json();

    return data;
}
