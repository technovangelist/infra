package cmd

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/infrahq/infra/internal/access"
	"github.com/infrahq/infra/internal/api"
)

func newDestinationsListCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "list",
		Aliases: []string{"ls"},
		Short:   "List connected destinations",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := defaultAPIClient()
			if err != nil {
				return err
			}

			destinations, err := client.ListDestinations(api.ListDestinationsRequest{})
			if err != nil {
				return err
			}

			type row struct {
				Name string `header:"NAME"`
				URL  string `header:"URL"`
			}

			var rows []row
			for _, d := range destinations {
				rows = append(rows, row{
					Name: d.Name,
					URL:  d.Connection.URL,
				})
			}

			printTable(rows)

			return nil
		},
	}
}

func newDestinationsAddCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "add TYPE NAME",
		Short: "Connect a destination",
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := defaultAPIClient()
			if err != nil {
				return err
			}

			destination := &api.CreateMachineRequest{
				Name:        args[1],
				Description: fmt.Sprintf("%s %s destination", args[1], args[0]),
				// TODO: create grants rather than static permissions
				Permissions: []string{
					string(access.PermissionUserRead),
					string(access.PermissionMachineRead),
					string(access.PermissionGroupRead),
					string(access.PermissionGrantRead),
					string(access.PermissionDestinationRead),
					string(access.PermissionDestinationCreate),
					string(access.PermissionDestinationUpdate),
				},
			}

			created, err := client.CreateMachine(destination)
			if err != nil {
				return err
			}

			lifetime := time.Hour * 24 * 365
			token, err := client.CreateAccessKey(&api.CreateAccessKeyRequest{
				MachineID: created.ID,
				Name:      fmt.Sprintf("access key presented by %s %s destination", args[1], args[0]),
				TTL:       lifetime.String(),
			})
			if err != nil {
				return err
			}

			if args[0] != "kubernetes" {
				return fmt.Errorf("Supported types: `kubernetes`")
			}

			config, err := currentHostConfig()
			if err != nil {
				return err
			}

			command := "    helm install infra-engine infrahq/engine"
			if len(args) > 1 {
				command += fmt.Sprintf(" --set config.name=%s", args[1])
			}
			command += fmt.Sprintf(" --set config.accessKey=%s ", token.AccessKey)
			command += fmt.Sprintf(" --set config.server=%s ", config.Host)

			// TODO: replace me with a certificate fingerprint
			// so even when users have self-signed certificates
			// infra can establish a secure TLS connection
			if config.SkipTLSVerify {
				command += "  --set config.skipTLSVerify=true"
			}

			fmt.Println()
			fmt.Println("Run the following command to connect a kubernetes cluster:")
			fmt.Println()
			fmt.Println(command)
			fmt.Println()
			fmt.Println()
			return nil
		},
	}
}

func newDestinationsRemoveCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "remove DESTINATION",
		Aliases: []string{"rm"},
		Short:   "Disconnect a destination",
		Args:    cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := defaultAPIClient()
			if err != nil {
				return err
			}

			destinations, err := client.ListDestinations(api.ListDestinationsRequest{Name: args[0]})
			if err != nil {
				return err
			}

			if len(destinations) == 0 {
				return fmt.Errorf("no destinations named %s", args[0])
			}

			for _, d := range destinations {
				err := client.DeleteDestination(d.ID)
				if err != nil {
					return err
				}
			}

			return nil
		},
	}
}
