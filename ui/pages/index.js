import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import Nav from '../components/nav/Nav'
import PageHeader from '../components/PageHeader'

import AuthContext from '../store/AuthContext'

const Container = styled.section`
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 18% auto;
`

export default function Index () {
  const { user } = useContext(AuthContext)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (user != null) {
      setCurrentUser(user)
    }
  }, [])

  return (
    <Container>
      <Nav />
      <div>
        <PageHeader iconPath='/access.svg' title='Access' />
      </div>
    </Container>
  )
}
