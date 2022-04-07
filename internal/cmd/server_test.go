package cmd

import (
	"testing"
	"time"

	"github.com/spf13/cobra"
	"gotest.tools/v3/assert"
	"gotest.tools/v3/fs"

	"github.com/infrahq/infra/internal/server"
)

func TestParseOptions_WithServerOptions(t *testing.T) {
	type testCase struct {
		name        string
		setup       func(t *testing.T, cmd *cobra.Command)
		expectedErr string
		expected    func(t *testing.T) server.Options
	}

	run := func(t *testing.T, tc testCase) {
		cmd := newServerCmd()

		if tc.setup != nil {
			tc.setup(t, cmd)
		}

		options := defaultServerOptions()
		err := parseOptions(cmd, &options, "INFRA_SERVER")
		if tc.expectedErr != "" {
			assert.ErrorContains(t, err, tc.expectedErr)
			return
		}

		assert.NilError(t, err)
		expected := tc.expected(t)
		assert.DeepEqual(t, expected, options)
	}

	var testCases = []testCase{
		{
			name: "secret providers",
			setup: func(t *testing.T, cmd *cobra.Command) {
				content := `
                    secrets:
                      - kind: env
                        name: base64env
                        config:
                          base64: true`

				dir := fs.NewDir(t, t.Name(),
					fs.WithFile("cfg.yaml", content))
				err := cmd.Flags().Set("config-file", dir.Join("cfg.yaml"))
				assert.NilError(t, err)
			},
			expected: func(t *testing.T) server.Options {
				expected := serverOptionsWithDefaults()
				expected.Secrets = []server.SecretProvider{
					{
						Kind: "env",
						Name: "base64env",
						Config: map[any]any{
							"base64": true,
						},
					},
				}
				return expected
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			run(t, tc)
		})
	}
}

// serverOptionsWithDefaults returns all the default values. Many defaults are
// specified in command line flags, which makes them difficult to access without
// specifying them again here.
func serverOptionsWithDefaults() server.Options {
	o := defaultServerOptions()
	o.TLSCache = "$HOME/.infra/cache"
	o.DBFile = "$HOME/.infra/sqlite3.db"
	o.DBEncryptionKey = "$HOME/.infra/sqlite3.db.key"
	o.DBEncryptionKeyProvider = "native"
	o.EnableTelemetry = true
	o.EnableCrashReporting = true
	o.SessionDuration = 12 * time.Hour
	o.EnableSetup = true
	return o
}
