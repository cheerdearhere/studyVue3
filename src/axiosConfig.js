import axios from "axios";

export default axios.create({
   baseURL  : `http://localhost:9000/`,
   method: 'post',
   timeout: 1000,
   headers: {
      'X-Custom-Header': 'foobar'
   },
   params: {
      ID: 12345
   },
   data: {
      firstName: 'Fred',
   },
});