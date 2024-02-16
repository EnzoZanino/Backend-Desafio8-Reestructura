const homeSocket = io();

async function updateUserEmailContainer() {
	try {
		const response = await fetch("/getUserEmail");
		const data = await response.json();

		let currentUserEmail = data.email;

		// Emitir el evento después de obtener el correo electrónico
		homeSocket.emit("connectUser", currentUserEmail);
	} catch (error) {
		console.error("Error al obtener el correo electrónico del usuario:", error);
	}
}
// Llamar a la función asíncrona
updateUserEmailContainer();

function handleLogout() {
	fetch("/users/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((result) => {
		if (result.status === 200) {
			window.location.replace("/");
		}
	});
}