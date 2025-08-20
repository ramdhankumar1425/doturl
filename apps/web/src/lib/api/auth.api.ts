function loginWithGoogle() {
	// Google OAuth redirect
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	if (!API_BASE_URL) throw new Error("API_URL is not provided.");

	window.location.href = API_BASE_URL + "/auth/google";
}

function loginWithGithub() {
	// Github OAuth redirect
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	if (!API_BASE_URL) throw new Error("API_URL is not provided.");

	window.location.href = API_BASE_URL + "/auth/github";
}

async function loginWithEmailPassword(email: string, password: string) {
	if (!email || !password) throw new Error("Email or Password not provided.");

	try {
	} catch (error) {}
}

async function logout() {}
