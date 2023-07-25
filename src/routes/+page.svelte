<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any;
	// This is data:
	// {
	// 	"formFields": {
	// 		"identifier": "",
	// 		"password": ""
	// 	},
	// 	"flowData": {
	// 		"csrfCookie": "csrf_token_806060ca5bf70dff3caa0e5c860002aade9d470a5a4dce73bcfa7ba10778f481=s8E2oAmdz2U98oGdrQs637XtOhjj0dfcSUYaUrlZyCM=",
	// 		"flowId": "e0ecba06-c8b1-4bc7-8084-94c0f9945d16"
	// 	},
	// 	"actionUrl": "http://edd-test.com:4433/self-service/login?flow=e0ecba06-c8b1-4bc7-8084-94c0f9945d16",
	// 	"csrfToken": "GUNluYCkqYhQ7GRQ85q/J1AdrHIaTNBS55On1PI8liqqglMZiTlm7W0e5c1ekYX45fCWavmdB46u1b2GS2VeCQ=="
	// }

	async function handleGoogleLogin(event) {
		try {
			console.log(JSON.stringify(data));
			event.preventDefault();
			// The handler for this endpoint is in the `src/routes/api/auth/google.ts` file.
			const response = await fetch(`/api/auth/google`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					// 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					flowId: data.flowData.flowId, //"54e3ebdf-06c9-45cd-8258-45a7619443f2"
					csrf_token: data.csrfToken, //"Fkly2KZpWPyCPxIMvkbuo09LBcEHlPes2dcwdvguVESNJC/gbVbP9CD5pPBct9dX4uvDsTbpIn6p0/YAXJH12w=="
					csrf_cookie: data.flowData.csrfCookie //"csrf_token_806060ca5bf70dff3caa0e5c860002aade9d470a5a4dce73bcfa7ba10778f481=m21dOMs/lwiixrb84vE59K2gxnAxfdXScATGdqS/oZ8="
				})
			});

			const responseData = await response.json();

			// If the response is a redirect, redirect the user to the redirect URL.
			// I believe this is where I lose my session in the browser.
			if (response.status >= 300 && response.status < 400 && responseData.redirectUrl) {
				window.location.href = responseData.redirectUrl;
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full">
		<h1 id="login-heading" class="text-3xl text-center font-bold mb-6">Sign In</h1>
		<form on:submit={handleGoogleLogin}>
			<input type="hidden" name="provider" value="google" />
			<input type="hidden" name="upstream_parameters.prompt" value="select_account" />
			<button type="submit">Sign in with Google</button>
		</form>
	</div>
</main>
