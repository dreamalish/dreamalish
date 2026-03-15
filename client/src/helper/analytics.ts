import ReactGA from "react-ga4";

export const initAnalytics = () => {
  ReactGA.initialize("G-19Z0YEFX87"); // your Measurement ID
};

export const trackPageView = (path: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path
  });
};