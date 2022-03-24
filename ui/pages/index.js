import { useContext, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import Nav from '../components/nav/Nav'
import Navigation from '../components/nav/Navigation'

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
      {/* <Navigation /> */}
      <Nav />
      <div>
        {currentUser ? <p>{currentUser.name}</p> : <></>}
      </div>
    </Container>
  )
}
