import axios from 'axios'

export const getKmItem = async (idCode: string) => {
  try {
    const response = await axios.get(`/ggi/api/map/km-item/${idCode}`)
    if (response.data.success === true) {
      return response
    } else {
      alert('물건 정보를 가져오는데 실패했습니다')
    }
  } catch (error) {
    console.error(error)
  }
}

export const getGmItem = async (goodsId: string) => {
  try {
    const response = await axios.get(`/ggi/api/map/gm-item/${goodsId}`)
    if (response.data.success === true) {
      return response
    } else {
      alert('물건 정보를 가져오는데 실패했습니다')
    }
  } catch (error) {
    console.error(error)
  }
}

export const getGgItem = async (goodsId: string) => {
  try {
    const response = await axios.get(`/ggi/api/map/gg-item/${goodsId}`)
    if (response.data.success === true) {
      return response
    } else {
      alert('물건 정보를 가져오는데 실패했습니다')
    }
  } catch (error) {
    console.error(error)
  }
}

export const getKwItem = async (idCode: string) => {
  try {
    const response = await axios.get(`/ggi/api/map/kw-item/${idCode}`)
    if (response.data.success === true) {
      return response
    } else {
      alert('물건 정보를 가져오는데 실패했습니다')
    }
  } catch (error) {
    console.error(error)
  }
}
