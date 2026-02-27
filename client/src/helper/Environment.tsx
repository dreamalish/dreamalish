let APIURL: string;

if (process.env.NODE_ENV === 'development') {
  APIURL = 'http://localhost:3002';
} else {
  APIURL = process.env.REACT_APP_API_URL || '';
}

export default APIURL;
