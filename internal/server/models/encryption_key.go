package models

type EncryptionKey struct {
	Model

	KeyID     int32 `gorm:"uniqueIndex"` // a short identifier for the key that can be embedded with the encrypted payload
	Name      string
	Encrypted []byte
	Algorithm string
	RootKeyID string
}
