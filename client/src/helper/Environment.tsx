let APIURL: string;

if (process.env.NODE_ENV === 'development') {
  APIURL = 'http://localhost:3002';
} else {
  APIURL = '';
}

export default APIURL;