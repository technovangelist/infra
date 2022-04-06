import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import styled from 'styled-components'

import Navigation from '../../components/nav/Navigation'
import PageHeader from '../../components/PageHeader'
import FormattedTime from '../../components/FormattedTime'
import EmptyPageHeader from '../../components/EmptyPageHeader'
import DestinationsContext, { DestinationsContextProvider } from '../../store/DestinationsContext'

const DestinationsHeaderContainer = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const AddDestinationLink = styled.a`
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 0%;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s ease-in;
  opacity: 1;

  span {
    margin-right: .25rem;
  }

  :hover {
    opacity: .6;
  }
`

const TableHeader = styled.div`
  display: grid;
  opacity: 0.5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  grid-template-columns: 80% 18% auto;
  align-items: center;
`

const TableHeaderTitle = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 0%;
  text-transform: uppercase;
`

const TableContent = styled.div`
  display: grid;
  grid-template-columns: 80% 18% auto;
  align-items: center;
`

const TableContentText = styled.div`
  font-weight: 300;
  font-size: 12px;
  line-height: 0px;

  a {
    cursor: pointer;

    :hover {
      opacity: .6;
    }
  }
`

const TableContentContainer = styled.div`
  padding-top: 1rem;
`

const Destinations = () => {
  const { destinations, updateDestinationsList } = useContext(DestinationsContext);
  const [destinationsList, setDestinationList] = useState([])

  console.log(destinationsList)

  useEffect(() => {
    if (destinations.length === 0) {
      axios.get('/v1/destinations')
			.then((response) => {
				console.log(response)
        const list = response.data
				setDestinationList(response.data)
        updateDestinationsList(list)
			})
			.catch((error) => {
				console.log(error)
			})
    } else {
      setDestinationList(destinations)
    }
  }, [])

  const handleAddDestination = async () => {
    await Router.push({
      pathname: '/destinations/add/setup'
    }, undefined, { shallow: true })
  }

  const handleRemove = (destination) => {
    // TODO: need to test this
    console.log('deleting: ', destination)
    axios.delete('/v1/destinations/${destination.id}')
      .then((response) => {
        console.log(response)
      })
  }

  return (
    <DestinationsContextProvider>
      <Head>
        <title>Infra - Destinations</title>
      </Head>
      <Navigation />
        <div>
          <DestinationsHeaderContainer>
            <PageHeader iconPath='/destinations.svg' title='Destinations' />
            <Link href='/destinations/add/setup'>
              <AddDestinationLink><span>&#43;</span>Add Destination</AddDestinationLink>
            </Link>
          </DestinationsHeaderContainer>
          <TableHeader>
            <TableHeaderTitle>Name</TableHeaderTitle>
            <TableHeaderTitle>Added</TableHeaderTitle>
          </TableHeader>
          <div>
            {destinationsList.length > 0
              ? (
                <TableContentContainer>
                  {destinationsList.map((item) => {
                    return (
                      <TableContent key={item.id}>
                        <TableContentText>{item.name}</TableContentText>
                        <TableContentText>
                          <FormattedTime time={item.created} />
                        </TableContentText>
                        <TableContentText>
                          <a onClick={() => handleRemove(item)}>&#x2715;</a>
                        </TableContentText>
                      </TableContent>
                    )
                  })}
                </TableContentContainer>
              )
            : (
              <EmptyPageHeader
                header='Destinations'
                subheader='No destinations connected.'
                actionButtonHeader='Add Destinations'
                onClickActionButton={() => handleAddDestination()}
              />
            )
            }
          </div>
        </div>
    </DestinationsContextProvider>
  )
}

export default Destinations
