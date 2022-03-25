import Link from 'next/link'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

import UserDropdown from './UserDropdown'

const NavContainer = styled.div`
  display: grid;
  grid-template-rows: auto 10%;
  border-right: .1rem solid #838383;
  min-height: 100vh;
`

const NavLogo = styled.div`
  padding-top: 3rem;
  padding-left: 21px;
  padding-bottom: 2.5rem;
`

const NavContent = styled.div`
  padding-left: 21px;

  & > *:not(:first-child) {
    padding-top: 2rem;
  }
`

const NavSubTitle = styled.span`
  font-weight: 400;
  font-size: 10px;
  line-height: 0%;
  color: #838383;
  text-transform: uppercase;
`

const NavTitlesGroup = styled.div`
  & > * {
    margin-top: 1rem;
  }
`

const NavItem = styled.div`
  cursor: pointer;

  &:hover {
    a {
      color: #FFFFFF;
    }
  }

  & > *:not(:first-child) {
    padding-left: .75rem;
  }  
`

const NavTitle = styled.a`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #B2B2B2;

  ${props =>
    props.selected && css`
      opacity: 1;
      color: #FFFFFF;
  `}
`

const NavImg = styled.img`
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
`

const NavFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding-left: 21px;
  padding-bottom: 20px;
`

const Nav = () => {
  const page = Object.freeze({ access: '/', infrastructure: '/infrastructure', providers: '/providers', users: '/local-user' })

  const router = useRouter()
  const pathname = router.pathname

  return (
    <NavContainer>
      <div>        
        <NavLogo><img src='/brand.svg' /></NavLogo>
        <NavContent>
          <div>
            <NavSubTitle>Administration</NavSubTitle>
            <NavTitlesGroup>
              <Link href='/'>
                <NavItem>
                  <NavImg src='/access.svg'/>
                  <NavTitle selected={pathname === page.access}>Access</NavTitle>
                </NavItem>
              </Link>
            </NavTitlesGroup>
          </div>
          <div>
            <NavSubTitle>Identities</NavSubTitle>
            <NavTitlesGroup>
              <Link href='/providers'>
                <NavItem>
                  <NavImg src='/identity-providers.svg'/>
                  <NavTitle selected={pathname === page.providers}>Identity Providers</NavTitle>
                </NavItem>
              </Link>
              <Link href='/local-user'>
                <NavItem>
                  <NavImg src='/local-users.svg'/>
                  <NavTitle selected={pathname === page.users}>Identities</NavTitle>
                </NavItem>
              </Link>
            </NavTitlesGroup>
          </div>
          <div>
            <NavSubTitle>Resources</NavSubTitle>
            <NavTitlesGroup>
              <Link href='/infrastructure'>
                <NavItem>
                  <NavImg src='/infrastructure.svg' />
                  <NavTitle selected={pathname === page.infrastructure}>Infrastructure</NavTitle>
                </NavItem>
              </Link>
            </NavTitlesGroup>
          </div>
        </NavContent>
      </div>
      <NavFooter>
        <UserDropdown />
      </NavFooter>
    </NavContainer>
  )
}

export default Nav