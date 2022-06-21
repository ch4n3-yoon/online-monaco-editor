import axios from "axios"

export const http = axios.create({
  baseURL: "/api/",
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