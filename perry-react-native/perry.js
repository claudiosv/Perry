import axios from 'axios'


const api = axios.create({
  baseURL: 'http://192.168.86.241:8080/device',
  headers: {
    Token: 'jnjrineifnajen',
  },
})

const getCoffeeShops = userLocation => {
  return api
    .get('/arduino-vespa/path')
    .then(res =>
      res.data.map(path => {
        return {
          name: path.date_added,
          coords: [path.latitude, path.longitude],
          children: path.device_id,
        }
      })
    )
    .catch(error => console.error(error))
}

export default {
  getCoffeeShops,
}