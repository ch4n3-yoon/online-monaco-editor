import axios from "axios"

export const http = axios.create({
  baseURL: "http://172.16.11.11:8000/api/",
  // headers: {},
  timeout: 30000,
//   withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
})

export const responseHandler = (response) => {
  return new Promise((resolve, reject) => {
    const { status, data } = response

    if (status === 200) resolve(data)
    else reject(data)
  })
}


export default {
  http,
  responseHandler,
}