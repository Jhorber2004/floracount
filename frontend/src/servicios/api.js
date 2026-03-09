import axios from 'axios'

const api = axios.create({
  baseURL: 'https://floracount-production.up.railway.app'
})

export const proveedores = {
  listar: () => api.get('/proveedores'),
  obtener: (codigo) => api.get(`/proveedores/${codigo}`)
}

export const variedades = {
  listar: () => api.get('/variedades')
}

export const mallas = {
  registrar: (datos) => api.post('/mallas', datos),
  listarPorProveedor: (codigo) => api.get(`/mallas/${codigo}`)
}

export const conteos = {
  registrar: (datos) => api.post('/conteos', datos),
  listar: () => api.get('/conteos'),
  alertas: () => api.get('/conteos/alertas')
}

export const estadosFlor = {
  listar: () => api.get('/estados-flor')
}

export default api