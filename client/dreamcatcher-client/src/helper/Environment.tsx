let APIURL = '';

switch (window.location.hostname) {
    case 'localhost' || '127.0.0.1':
        APIURL = 'http://localhost:3002';
        break;
    case 'dreamalish.onrender.com':
        APIURL = 'https://dreamalish.onrender.com';
        
}

export default APIURL;