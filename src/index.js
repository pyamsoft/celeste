// Polyfills
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "intersection-observer";
// CSS
import "./index.css";
// Web analytics
import { reportWebVitals } from "./reportWebVitals";
// API preparation
import "./firebase";
// Loads the apop
import "./app";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
