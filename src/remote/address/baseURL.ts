import axios from 'axios'

const baseApiURL = `req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key=${process.env.NEXT_PUBLIC_GONG_GONG_API_KEY}`

const headers = {
  'Content-Type': 'application/json',
}

const baseApiInstance = axios.create({
  baseURL: baseApiURL,
  headers,
})

export default baseApiInstance
