package certs

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"math/big"
	"net"
	"time"

	"golang.org/x/crypto/acme/autocert"

	"github.com/infrahq/infra/internal/logging"
)

func SelfSignedCert(hosts []string) ([]byte, []byte, error) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, nil, err
	}

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)

	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		return nil, nil, err
	}

	cert := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			Organization: []string{"Infra"},
		},
		NotBefore:             time.Now().Add(-5 * time.Minute).UTC(),
		NotAfter:              time.Now().AddDate(0, 0, 365).UTC(),
		KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment | x509.KeyUsageCertSign,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	for _, h := range hosts {
		if ip := net.ParseIP(h); ip != nil {
			cert.IPAddresses = append(cert.IPAddresses, ip)
		} else {
			cert.DNSNames = append(cert.DNSNames, h)
		}
	}

	certBytes, err := x509.CreateCertificate(rand.Reader, &cert, &cert, &priv.PublicKey, priv)
	if err != nil {
		return nil, nil, err
	}

	certPEM := new(bytes.Buffer)
	if err := pem.Encode(certPEM, &pem.Block{Type: "CERTIFICATE", Bytes: certBytes}); err != nil {
		return nil, nil, err
	}

	keyBytes, err := x509.MarshalPKCS8PrivateKey(priv)
	if err != nil {
		return nil, nil, err
	}

	keyPEM := new(bytes.Buffer)
	if err := pem.Encode(keyPEM, &pem.Block{Type: "PRIVATE KEY", Bytes: keyBytes}); err != nil {
		return nil, nil, err
	}

	return certPEM.Bytes(), keyPEM.Bytes(), nil
}

func SelfSignedOrLetsEncryptCert(manager *autocert.Manager, serverName string) func(hello *tls.ClientHelloInfo) (*tls.Certificate, error) {
	return func(hello *tls.ClientHelloInfo) (*tls.Certificate, error) {
		cert, err := manager.GetCertificate(hello)
		if err == nil {
			return cert, nil
		}

		if serverName == "" {
			serverName = hello.ServerName
		}

		if serverName == "" {
			serverName = hello.Conn.LocalAddr().String()
		}

		certBytes, err := manager.Cache.Get(context.TODO(), serverName+".crt")
		if err != nil {
			logging.S.Warnf("cert: %s", err)
		}

		keyBytes, err := manager.Cache.Get(context.TODO(), serverName+".key")
		if err != nil {
			logging.S.Warnf("key: %s", err)
		}

		// if either cert or key is missing, create it
		if certBytes == nil || keyBytes == nil {
			certBytes, keyBytes, err = SelfSignedCert([]string{serverName})
			if err != nil {
				return nil, err
			}

			if err := manager.Cache.Put(context.TODO(), serverName+".crt", certBytes); err != nil {
				return nil, err
			}

			if err := manager.Cache.Put(context.TODO(), serverName+".key", keyBytes); err != nil {
				return nil, err
			}
		}

		keypair, err := tls.X509KeyPair(certBytes, keyBytes)
		if err != nil {
			return nil, err
		}

		return &keypair, nil
	}
}
