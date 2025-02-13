package models

import (
	"database/sql/driver"
	"fmt"

	"github.com/infrahq/infra/secrets"
)

// EncryptedAtRest defines a field that knows how to encrypt and decrypt itself with Gorm
// it depends on the SymmetricKey being set for this package.
type EncryptedAtRest string

// SymmetricKey is the key used to encrypt and decrypt this field.
var SymmetricKey *secrets.SymmetricKey

func (s EncryptedAtRest) Value() (driver.Value, error) {
	if SymmetricKey == nil {
		return nil, fmt.Errorf("models.SymmetricKey is not set")
	}

	b, err := secrets.Seal(SymmetricKey, []byte(s))
	if err != nil {
		return nil, fmt.Errorf("sealing secret field: %w", err)
	}

	return string(b), err
}

func (s *EncryptedAtRest) Scan(v interface{}) error {
	if SymmetricKey == nil {
		return fmt.Errorf("models.SymmetricKey is not set")
	}

	vStr, ok := v.(string)
	if !ok {
		return fmt.Errorf("unsupported type: %T", v)
	}

	b, err := secrets.Unseal(SymmetricKey, []byte(vStr))
	if err != nil {
		return fmt.Errorf("unsealing secret field: %w", err)
	}

	*s = EncryptedAtRest(b)

	return nil
}
