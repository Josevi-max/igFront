import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configura Laravel Echo
const echo = new Echo({
    broadcaster: 'reverb',
    key: 'your-reverb-key',
    wsHost: window.location.hostname,
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'], 
});

export default echo;