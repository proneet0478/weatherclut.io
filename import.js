import _ from "lodash";   // example npm package
import "./myScript1.js";  // your custom file
import "./myScript2.js";  // another file

console.log("Lodash version:", _.VERSION);

// Import npm packages
import _ from "lodash";
import axios from "axios";

// Import your own scripts
import "./myScript1.js";
import "./myScript2.js";

// Test packages
console.log("Lodash version:", _.VERSION);

axios.get("https://jsonplaceholder.typicode.com/todos/1")
  .then(res => console.log("Axios data:", res.data));
