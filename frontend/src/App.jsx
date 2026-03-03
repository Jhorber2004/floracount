import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './paginas/Inicio'
import Conteo from './paginas/Conteo'
import Alertas from './paginas/Alertas'
import Mallas from './paginas/Mallas'
import Navbar from './componentes/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/conteo" element={<Conteo />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/mallas" element={<Mallas />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App