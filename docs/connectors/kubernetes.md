# Kubernetes

## Installing the connector

### Install the connector via `helm`:

In order to add connectors to Infra, you will need to set three pieces of information:

* `connector.config.name` is a name you give to identify this cluster
* `connector.config.server` is the hostname or IP address the connector will use to communicate with the Infra server.
* `connector.config.accessKey` is the access key the connector will use to communicate with the server.

First, generate an access key:

```
infra keys add KEY_NAME connector
```

Next, use this access key to connect your cluster:

```bash
helm upgrade --install infra-connector infrahq/infra \
    --set connector.config.server=INFRA_URL \
    --set connector.config.accessKey=ACCESS_KEY \
    --set connector.config.name=example-name \
    --set connector.config.skipTLSVerify=true # only include if you have not yet configured certificates
```


## Granting access

Once you've connected a cluster, you can grant access via `infra grants add`:

```
# grant access to a user
infra grants add fisher@example.com kubernetes.example --role admin

# grant access to a group
infra grants add engineering kubernetes.example --role view
```

### Roles

| Role | Access level |
| --- | --- |
| cluster-admin | Grants access to any resource |
| admin | Grants access to most resources, including roles and role bindings, but does not grant access to cluster-level resources such as cluster roles or cluster role bindings |
| edit | Grants access to most resources in the namespace but does not grant access to roles or role bindings
| view | Grants access to read most resources in the namespace but does not grant write access nor does it grant read access to secrets |

### Example: Grant user `dev@example.com` the `view` role to a cluster

This command will grant the user `dev@example.com` read-only access into a cluster, giving that user the privileges to query Kubernetes resources but not modify any resources.

```bash
infra grants add dev@example.com kubernetes.cluster --role view
```

### Example: Grant user `ops@example.com` the `admin` role to a namespace

This command will grant the user `ops@example.com` admin access into a namespace, giving that user the privileges to create, update, and delete any resource so long as the resources they’re modifying exist in the namespace.

```bash
infra grants add ops@example.com kubernetes.cluster.namespace --role admin
```

### Example: Revoke from the user `ops@example.com` the `admin` role to a namespace

This command will remove the `admin` role, granted in the previous example, from `ops@example.com`.

```bash
infra grants remove ops@example.com kubernetes.cluster.namespace --role cluster-admin
```

## Additional Information

- [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
