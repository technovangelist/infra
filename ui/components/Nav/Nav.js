import Link from 'next/link'
import styled, { css } from 'styled-components'

import UserDropdown from './UserDropdown'

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-right: .15rem solid #838383;
  min-height: 100vh;

  & > *:not(:first-child) {
    padding-top: 1rem;
  }
`

const NavLogo = styled.div`
  padding-left: 21px;
  padding-top: 20px;
  padding-bottom: 40px;
`

const NavContent = styled.div`
  padding-left: 21px;

  & > *:not(:first-child) {
    padding-top: 2rem;
  }
`

const NavSubTitle = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 0%;
  color: #838383;
  text-transform: uppercase;
`

const NavTitlesGroup = styled.div`
  padding-top: 1rem;

  & > *:not(:first-child) {
    padding-top: 1rem;
  }
`

const NavTitle = styled.a`
  padding-left: .75rem;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #B2B2B2;
`

const NavImg = styled.img`
  width: 12px;
  height: 12px;
`

const Nav = () => {
  return (
    <NavContainer>
      <NavLogo><img src='/brand.svg' /></NavLogo>
      <NavContent>
        <div>
          <NavSubTitle>Administration</NavSubTitle>
          <NavTitlesGroup>
            <Link href='/'>
              <div>
                <NavImg src='/access.svg'/>
                <NavTitle>Access</NavTitle>
              </div>
            </Link>
          </NavTitlesGroup>
        </div>
        <div>
          <NavSubTitle>Identities</NavSubTitle>
          <NavTitlesGroup>
            <Link href='/providers'>
              <div>
                <NavImg src='/identity-providers.svg'/>
                <NavTitle>Identity Providers</NavTitle>
              </div>
            </Link>
            <Link href='/local-user'>
              <div>
                <NavImg src='/local-users.svg'/>
                <NavTitle>Identities</NavTitle>
              </div>
            </Link>
          </NavTitlesGroup>
        </div>
        <div>
          <NavSubTitle>Resources</NavSubTitle>
          <NavTitlesGroup>
            <Link href='/infrastructure'>
              <div>
                <NavImg src='/infrastructure.svg' />
                <NavTitle>Infrastructure</NavTitle>
              </div>
            </Link>
          </NavTitlesGroup>
        </div>
      </NavContent>
      <UserDropdown />
    </NavContainer>
  )
}

export default Nav