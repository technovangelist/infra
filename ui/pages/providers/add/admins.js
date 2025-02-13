import { useCallback, useState, useContext } from 'react'
import axios from 'axios'
import Router from 'next/router'

import { AddContainer, AddContainerContent, Nav, Footer } from './[type]'
import ExitButton from '../../../components/ExitButton'
import ActionButton from '../../../components/ActionButton'
import AddAdmin from '../../../components/providers/okta/AddAdmin'

import AuthContext from '../../../store/AuthContext'

const grantAdminAccess = async (userId) => {
  await axios.post('/v1/grants', { identity: userId, resource: 'infra', privilege: 'admin' })
    .then(async () => {
      await Router.push({ pathname: '/providers' }, undefined, { shallow: true })
    }).catch((error) => {
      console.log(error)
    })
}

const Admins = () => {
  const { newestProvider } = useContext(AuthContext)

  const [adminEmail, setAdminEmail] = useState('')

  const updateEmail = useCallback((email) => {
    setAdminEmail(email)
  })

  const moveToNext = async () => {
    const providerId = newestProvider && newestProvider.id
    const params = {
      email: adminEmail,
      provider_id: providerId
    }

    await axios.get('/v1/users', { params })
      .then(async (response) => {
        if (response.data.length === 0) {
          await axios.post('/v1/users',
            { email: adminEmail, providerID: providerId })
            .then(async (response) => {
              await grantAdminAccess(response.data.id)
            }).catch((error) => {
              console.log(error)
            })
        } else {
          grantAdminAccess(response.data[0].id)
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <AddContainer>
        <AddContainerContent>
          <AddAdmin email={adminEmail} parentCallback={updateEmail} />
        </AddContainerContent>
        <Nav>
          <ExitButton previousPage='/providers' />
        </Nav>
      </AddContainer>
      <Footer>
        <ActionButton onClick={() => moveToNext()} value='Proceed' size='small' />
      </Footer>
    </>
  )
}

export default Admins
