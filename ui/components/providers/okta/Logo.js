import styled from 'styled-components'

const LogoContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  width: 6rem;
  height: 2rem;
`

const OktaLogo = styled.img`
  width: 33.27px;
  height: 11.2px;
  margin-top: 5%;
`

const ConnectedArrowLogo = styled.img`
  width: 13px;
  height: 6px;
  margin-top: 8%;
`

const InfraLogo = styled.img`
  width: 21px;
  height: 21px;
`

const Logo = () => {
  return (
    <LogoContainer>
      <OktaLogo src='/okta.svg' />
      <ConnectedArrowLogo src='/connected-arrow.svg' />
      <InfraLogo src='/infra-icon.svg' />
    </LogoContainer>
  )
}

export default Logo
