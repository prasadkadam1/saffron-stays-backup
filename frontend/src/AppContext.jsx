import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

export let context = createContext()
const AppContext = ({ children }) => {
  let [tents, setTents] = useState([])
  let [hotels, sethotels] = useState([])
  let [cottages, setCottages] = useState([])
  let [treehouses, settreehouses] = useState([])
  let [farmHouses, setfarmHouses] = useState([])
  let [homestays, sethomestays] = useState([])
  let [villas, setvillas] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/tents').then((res) => {
      setTents(res.data)
    })
    axios.get('http://localhost:5000/cottages').then((res) => {
      setCottages(res.data)
    })
    axios.get('http://localhost:5000/farmhouses').then((res) => {
      setfarmHouses(res.data)
    })
    axios.get('http://localhost:5000/hotels').then((res) => {
      sethotels(res.data)
    })
    axios.get('http://localhost:5000/homestays').then((res) => {
      sethomestays(res.data)
    })
    axios.get('http://localhost:5000/treehouses').then((res) => {
      settreehouses(res.data)
    })
    axios.get('http://localhost:5000/villas').then((res) => {
      setvillas(res.data)
    })
  }, [])

  return (
    <context.Provider value={{
      tents,
      setTents,
      cottages,
      setCottages,
      farmHouses,
      setfarmHouses,
      hotels,
      sethotels,
      homestays,
      sethomestays,
      treehouses,
      settreehouses,
      villas,
      setvillas
    }}>{children}</context.Provider>
  )
}

export default AppContext