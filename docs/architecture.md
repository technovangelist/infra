# Architecture

This page documents the system and software architecture of Infra. It follows the
[C4 model] for documenting software systems.

[C4 model]: https://c4model.com/

## System Context

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


## Containers


