import type { AuthFlowAction } from "../types";

export async function requestInitialFlowData(action: AuthFlowAction) {
    const response = await fetch(`http://localhost:5173/api/auth/${action}`);

    const responseData = await response.json();

    const formData = responseData.formData;
    const flowData = responseData.flowData;
    let csrfToken: string | undefined;
    const formFields: { [key: string]: string } = {};
    const actionUrl = formData.ui.action;

    for (const field of formData?.ui.nodes ?? []) {
        if (field.attributes.name === 'csrf_token') {
            csrfToken = field.attributes.value;
        }

        if (field.meta.label && field.meta.label.text && field.attributes.name !== 'method' && field.group !== 'oidc') {
            formFields[field.attributes.name] = '';
        }
    }
    return { formFields, flowData, actionUrl, csrfToken }
}
