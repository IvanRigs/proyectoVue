const { createApp, ref } = Vue;

createApp({
    setup() {
        const username = ref('');
        const password = ref('');

        username.value = localStorage.getItem('username');

        const errorLogin = ref(false);
        const requestToken = ref('');
        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';
        const sessionId = ref('');

        // Obtener el token para el id del usuario
        fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                requestToken.value = data.request_token;
                console.log('Request Token:', requestToken);
            })
            .catch(error => console.error('Error obteniendo el request token:', error));

        //Verifica el login y obtiene el id
        const postLogin = () => {
            fetch('https://api.themoviedb.org/3/authentication/token/validate_with_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGM3MjgzMGIzZTUwZjRmZGQzODU3ZGVhOGNiNWQ5NyIsIm5iZiI6MTcyNzIyNjUwOS45NjU1OTEsInN1YiI6IjY2ZjBiODRmMDIyMDhjNjdjODhjZmMzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P8jdnLk2KpWpELcLJ_BDTAdx1DVAEUi8ynbrXQDv_xA'
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                    request_token: requestToken.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Login exitoso, token validado:', requestToken.value);

                        fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                request_token: requestToken.value
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    sessionId.value = data.session_id;
                                    localStorage.setItem('sessionId', sessionId.value);
                                    console.log('Session creada:', sessionId.value);
                                    location.href = "../home/home.html";
                                } else {
                                    console.error('Error al crear la sesión:', data);
                                }
                            })
                            .catch(error => console.error('Error al crear la sesión:', error));
                    } else {
                        errorLogin.value = true;
                        console.error('Error de login:', data.status_message);
                    }
                })
                .catch(error => console.error('Error al validar el request token:', error));
        };

        return {
            username,
            password,
            errorLogin,
            postLogin,
        };
    }
}).mount('#app');
