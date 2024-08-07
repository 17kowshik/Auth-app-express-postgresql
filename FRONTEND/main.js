// Update fetch URLs to point to your deployed backend URL
const backendUrl = 'https://auth-app-express-postgresql.vercel.app';

// Login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${backendUrl}/login`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Login successful:', data);
            localStorage.setItem('token', data.token);
            window.location.href = 'home.html';
        } else {
            console.error('Login failed:', data.message);
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Registration
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'home.html';
        } else {
            console.error('Registration failed:', data.message);
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
