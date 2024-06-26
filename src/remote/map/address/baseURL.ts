import axios from 'axios'

const baseApiURL = `https://api.vworld.kr`

const headers = {
  'Content-Type': 'application/json',
}

const baseApiInstance = axios.create({
  baseURL: baseApiURL,
  headers,
})

export default baseApiInstance
