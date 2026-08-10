import React from 'react'
import { useParams } from 'react-router-dom'

function Execucao() {
  const { id } = useParams()

  return (
    <div>Execucao - {id}</div>
  )
}

export default Execucao
