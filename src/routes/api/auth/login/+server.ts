import { initializeAuthFlow, requestAuthFlowFormData } from "../../../../lib/auth/backend/auth";

const authFlowAction = 'login';

export async function GET() {
    try {
        const flowData = await initializeAuthFlow(authFlowAction);
        const formData = await requestAuthFlowFormData(authFlowAction, flowData)
        return new Response(JSON.stringify({ flowData, formData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(`Internal Server Error: ${JSON.stringify(error)}`, { status: 500 });
    }
}
