import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl text-blue-500 font-bold underline">
      ¡Bienvenido a tu Analista de Datos!
      </h1>
    </>
  )
}

export default App
