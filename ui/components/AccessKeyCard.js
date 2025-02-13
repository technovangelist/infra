import PropTypes from 'prop-types'
import styled from 'styled-components'
import html2canvas from 'html2canvas'
import { jsPDF as PDF } from 'jspdf'

const AccessKeyCardContainer = styled.section`
  max-width: 24rem;
  height: 194px;
  background: #0E151C;
  border: 1px solid #3B3B3B;
  /* border: 1px solid; */
  /* border-image: linear-gradient(to left, #000000 100%, #FC7CFF 44%, #11B9DE 52%); */
  box-sizing: border-box;
  box-shadow: -38px 3px 44px rgba(0, 0, 0, 0.63);
  border-radius: 20px;
  padding: 1rem 0;
`

const AccessKeyCardTitle = styled.div`
  font-weight: 400;
  font-size: 8px;
  line-height: 167.02%;
  opacity: 0.56;
  text-transform: uppercase;
  padding-left: 15px;
`

// TODO
const AccessKeyRectangle = styled.div`
  max-width: 24rem;
  height: 47px;
  background: linear-gradient(270.09deg, #0F1011 -29.65%, rgba(94, 94, 94, 0) 86.18%);
  padding-top: 7px;
  padding-bottom: 19px;
`

const AccessKeyContent = styled.div`
  display: flex;
  flex-direction: row;
`

const AccessKeyInfraLogo = styled.img`
  width: 56px;
  height: 47px;
  padding-left: 12px;
`

const AccessKeyInforContainer = styled.div`
  padding-left: .5rem;
`

const AccessKeyTitle = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.035em;
  opacity: 0.3;
  text-transform: uppercase;
`

const AccessKeyText = styled.div`
  font-weight: 300;
  font-size: 13px;
  line-height: 88.5%;
  padding-top: 11px;
  word-break: break-word;
`

const AccessKeyButtonGroups = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding-right: 0.5rem;
  padding-top: 1rem;
`

const AccessKeyButton = styled.button`
  display: flex;
  flex-direction: row;
  border: 0;
  background: transparent;
  cursor: pointer;

  & > *:not(:first-child) {
    padding-left: .5rem;
  }
`

const AccessKeyButtonText = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  letter-spacing: -0.035em;
  opacity: 0.45;
  padding-left: .5rem;
  color: #FFFFFF;

  &:hover {
    opacity: 1;
  }
`

const AccessKeyButtonIcon = styled.img`
  width: 10px;
  height: 13px;
`

const AccessKeyCard = ({ accessKey }) => {
  const handleDownloadPdf = () => {
    const input = document.getElementById('divToDownload')
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new PDF()
        pdf.addImage(imgData, 'JPEG', 0, 0)
        pdf.save('accessKey.pdf')
      })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(accessKey).then(() => {
      window.alert('Copied the access key!')
    }, () => {
      window.alert('Oops! Something went wrong, please try again!')
    })
  }

  return (
    <AccessKeyCardContainer id='divToDownload'>
      <AccessKeyCardTitle>Infra Access Key</AccessKeyCardTitle>
      <AccessKeyRectangle />
      <AccessKeyContent>
        <AccessKeyInfraLogo src='/card-infra-logo.svg' />
        <AccessKeyInforContainer>
          <AccessKeyTitle>Access Key</AccessKeyTitle>
          <AccessKeyText>{accessKey}</AccessKeyText>
        </AccessKeyInforContainer>
      </AccessKeyContent>
      <AccessKeyButtonGroups>
        <AccessKeyButton onClick={() => handleCopy()}>
          <AccessKeyButtonIcon src='/copy-icon.svg' />
          <AccessKeyButtonText>COPY</AccessKeyButtonText>
        </AccessKeyButton>
        <AccessKeyButton onClick={() => handleDownloadPdf()}>
          <AccessKeyButtonIcon src='/pdf-icon.svg' />
          <AccessKeyButtonText>PDF</AccessKeyButtonText>
        </AccessKeyButton>
      </AccessKeyButtonGroups>
    </AccessKeyCardContainer>
  )
}

AccessKeyCard.prototype = {
  accessKey: PropTypes.string.isRequired
}

export default AccessKeyCard
