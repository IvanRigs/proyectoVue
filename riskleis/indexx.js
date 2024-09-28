const { createApp, ref } = Vue;

createApp({
    setup() {
        const username = ref('');

        const enviarUsername = () => {
            if (!(username.value === '')) {
                localStorage.setItem('username', username.value);
                window.location.href = "login/login.html";
            }

        }

        return {
            username,
            enviarUsername
        };
    }
}).mount('#app');