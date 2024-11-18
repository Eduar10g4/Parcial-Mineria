import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl text-red-500 font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App
