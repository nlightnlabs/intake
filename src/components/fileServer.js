import axios from "axios";
console.log(`Environment: ${process.env.NODE_ENV}`);

const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"

console.log(baseURL);
export default axios.create({
    baseURL,
})