const fetch = require('node-fetch');

async function seedAdmin() {
    try {
        const response = await fetch("http://localhost:8080/users/saveUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "System Admin",
                userName: "admin",
                email: "admin@example.com",
                password: "admin",
                role: "ADMIN",
                enabled: true
            })
        });
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

seedAdmin();
