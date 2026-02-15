let APIURL = '';

if (window.location.hostname === 'localhost') {
  APIURL = 'http://localhost:3002';
} else {
  // When deployed, use SAME ORIGIN (Render backend)
  APIURL = '';
}

export default APIURL;

