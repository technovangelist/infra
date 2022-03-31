# Architecture

This page documents the system and software architecture of Infra. It follows the
[C4 model] for documenting software systems.

[C4 model]: https://c4model.com/

## System Context

The system context shows how users, Infra, and external systems interact.

```mermaid
flowchart TD

    UserDev("Developer \n[Person]")
    UserAdmin("Administrator\n[Person]")
    class UserDev,UserAdmin User;
    classDef User fill:#048,stroke-width:0px,color:#fff;

    Infra["Infra\n[Software System]"]
    class Infra System;
    classDef System fill:#05d,stroke-width:0px,color:#fff;

    IDP["Identity Provider (Okta)\n[Software System]"]
    Destination["Destination (Kubernetes)\n[Software System]"]
    class IDP,Destination External;
    classDef External fill:#777,stroke-width:0px,color:#fff;

    UserDev-.->|login using|Infra
    UserDev-.->|connects to|Destination

    UserAdmin-.->|creates identities|IDP
    UserAdmin-.->|grants access|Infra

    Infra-.->|reads identities|IDP
    Infra-.->|creates credentials|Destination
```


## Infra Containers

The Infra system is comprised of 4 containers.


```mermaid
flowchart TD

    UserDev("Developer \n[Person]")
    UserAdmin("Administrator\n[Person]")
    class UserDev,UserAdmin User;
    classDef User fill:#048,stroke-width:0px,color:#fff;

    subgraph infra[ ]
    Server["API Server\n[Go binary in a kubernetes pod]"]
    Connector["Destination Connector\n[Go binary in a kubernetes pod]"]
    CLI["Infra CLI\n[Go binary on a desktop]"\n]
    UI["Infra Web UI\n[frontend in a web brower]"]
    class Server,Connector,CLI,UI Container;
    classDef Container fill:#05d,stroke-width:0px,color:#fff;
    end
    style infra fill:transparent,stroke:#333,stroke-width:1px,color:#fff,stroke-dasharray: 10 10;

    AdminAutomation["Admin Automation\n[Software System]"]
    IDP["Identity Provider (Okta)\n[Software System]"]
    Destination["Destination (Kubernetes)\n[Software System]"]
    Database[("Database (PostgreSQL)\n[Software System]")]
    SecretsStore[("Secrets Store\n[Software System]")]
    class IDP,Destination,AdminAutomation,Database,SecretsStore External;
    classDef External fill:#777,stroke-width:0px,color:#fff;

    UserDev-.->|login|CLI
    UserAdmin-.->CLI
    UserAdmin-.->UI
    UserAdmin-.->AdminAutomation

    AdminAutomation-.->Server
    CLI-.->Server
    UI-.->Server

    Connector-.->|creates credentials|Destination
    Connector-.->|query grants for identity|Server

    Server-.->|query identity for user|IDP
    Server-.->|query and store|Database
    Server-.->|get or save secret|SecretsStore
```

### API Server

```mermaid
flowchart TD

    CLI
    UI
    Connector
    class CLI,UI,Connector Container;
    classDef Container fill:#05d,stroke-width:0px,color:#fff;

    subgraph server[ ]
    API
    Secrets
    DataPersistence
    OIDCClient[ODIC Client]

    class API,Secrets,DataPersistence,OIDCClient Component;
    classDef Component fill:#59d,stroke-width:0px,color:#fff;
    end
    style server fill:transparent,stroke:#333,stroke-width:1px,color:#fff,stroke-dasharray: 10 10;

    AdminAutomation["Admin Automation\n[Software System]"]
    IDP["Identity Provider (Okta)\n[Software System]"]
    Database[("Database (PostgreSQL)\n[Software System]")]
    SecretsStore[("Secrets Store\n[Software System]")]
    class IDP,Destination,AdminAutomation,Database,SecretsStore External;
    classDef External fill:#777,stroke-width:0px,color:#fff;

    AdminAutomation-.->API
    CLI-.->API
    UI-.->API

    API-.->Secrets
    API-.->DataPersistence
    API-.->OIDCClient

    Connector-.->API
    DataPersistence-.->Database
    OIDCClient-.->IDP
    Secrets-.->SecretsStore
```

### Destination Connector

```mermaid
flowchart TD

    UserDev("Developer \n[Person]")
    class UserDev,UserAdmin User;
    classDef User fill:#048,stroke-width:0px,color:#fff;

    APIServer[API Server]
    class APIServer Container;
    classDef Container fill:#05d,stroke-width:0px,color:#fff;

    subgraph connector[ ]
    KubernetesClient[Kubernetes Client]
    Reconciler[\RoleBinding Reconciler/]
    APIClient[API Client]
    KubernetesAPIProxy[Kubernetes API Proxy]
    JWKCache[JWK Cache]

    class KubernetesClient,Reconciler,APIClient,TLSServer,KubernetesAPIProxy,JWKCache Component;
    classDef Component fill:#59d,stroke-width:0px,color:#fff;
    end
    style connector fill:transparent,stroke:#333,stroke-width:1px,color:#fff,stroke-dasharray: 10 10;

    Destination["Destination (Kubernetes)\n[Software System]"]
    class Destination External;
    classDef External fill:#777,stroke-width:0px,color:#fff;

    APIClient-.->|query grants*|APIServer
    Reconciler-.->KubernetesClient
    KubernetesClient-.->|query and write roles and bindings|Destination
    Reconciler-.->APIClient

    UserDev-.->|kubernetes API request|KubernetesAPIProxy
    KubernetesAPIProxy-.->|forward request with impersonation|Destination

    KubernetesAPIProxy-.->JWKCache
    JWKCache-.->|request public key|APIServer
```

### Command Line Interface (CLI)

### Web UI

## Code

### Grant Entities

```mermaid
erDiagram
    Grant {
        Identity Subject
        string Privilege
        string Resource
    }

    Identity ||--o| User: "one of"
    Identity ||--o| Machine: "one of"
    Identity ||--o| Group: "one of"
    User }|--o{ Group: "member of"

    IdentityProvider }|--|{ User: "authenticates"
    IdentityProvider ||--|{ Group: "defines"

    Destination ||--|{ Resource: "defines"
    Grant ||--|| Resource: "identifies"

    Identity ||--|{ Grant: "receives access from"
```
