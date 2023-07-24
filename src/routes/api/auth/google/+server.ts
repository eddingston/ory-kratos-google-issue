export async function POST(request) {
    try {
        const data = await request.request.json();
        // This is data:
        // {
        //     flowId: data.flowData.flowId, //"54e3ebdf-06c9-45cd-8258-45a7619443f2"
        //     csrf_token: data.csrfToken, //"Fkly2KZpWPyCPxIMvkbuo09LBcEHlPes2dcwdvguVESNJC/gbVbP9CD5pPBct9dX4uvDsTbpIn6p0/YAXJH12w=="
        //     csrf_cookie: data.flowData.csrfCookie //"csrf_token_806060ca5bf70dff3caa0e5c860002aade9d470a5a4dce73bcfa7ba10778f481=m21dOMs/lwiixrb84vE59K2gxnAxfdXScATGdqS/oZ8="
        // }

        const cookies = request.request.headers.get('Cookie');
        // The value of cookies is "csrf_token_806060ca5bf70dff3caa0e5c860002aade9d470a5a4dce73bcfa7ba10778f481=U9xzGIypFHy/L+K/QNy30ucZDGjywQrMTJEJgSLEBi4="

        // Create an instance of URLSearchParams
        const formData = new URLSearchParams();

        // Populate the formData with data from your JSON object
        for (const key in data) {
            formData.append(key, data[key]);
        }

        // Populate the formData with data from your JSON object\
        const response = await fetch(`http://localhost:4433/self-service/login?flow=${data.flowId}&provider=google`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies, // I do not believe this is doing anything here. Same result with or without it.
            },
            body: formData.toString(),
            redirect: 'manual',
        });

        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('Location');
            return new Response(JSON.stringify({ redirectUrl }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            const responseData = await response.json();
            return new Response(JSON.stringify(responseData), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        return new Response(`Internal Server Error: ${error}`, { status: 500 });
    }
}
