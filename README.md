# aic_verified_helpdesk
Sample P1AIC journey to demonstrate integration with P1Verify for the verified helpdesk usecase.

## Setup Steps

In order to deploy this reference implementation follow the following steps to:
1. Setup a PingOne environment
2. Create a Worker Application in the PingOne tenant
3. Create the required Environment Secrets and Variables (ESVs) in P1AIC
4. Import the custom nodes
5. Import the journeys
6. Test the implementation

### Setup a PingOne Environment

In this section we’ll create a PingOne environment with PingOne Protect deployed:

1. If you have a PingOne subscription navigate to [this](https://www.pingidentity.com/en.html) page and hit “Sign On” at the top right of the page and login.
2. On success you’ll be re-directed to the https://console.pingone.eu/ page. If you don’t have a subscription, you can get a demo environment through [this](this) link. Enter your business email address and hit “Try Ping”.
3. From the PingOne Console > Hit Environments on the left panel > Blue + icon next to Environments.
4. Select Build your own solution > click PingOne Verify > Hit Next.
5. On the environment name enter an appropriate name, for example `env-pingoneaic-mycompany-ew2-sandbox1` > Select the region > Hit Finish.

### Create a Worker Application in a P1AIC Tenant

1. Follow [these](https://docs.pingidentity.com/pingoneaic/integrations/pingone-set-up-workers.html#create-a-worker-application-in-each-mapped-pingone-environment) Task 2 steps to create OIDC credentials for the PingOne AIC tenant to integrate with PingOne Verify. Note the PingOne API and Authorization URLs, for example https://auth.pingone.com, https://auth.pingone.eu etc.

### Create a PingOne Service in P1AIC

1. Follow [these](https://docs.pingidentity.com/pingoneaic/integrations/pingone-set-up-workers.html#create-esvs-for-the-worker-application-credentials-in-each-tenant-environment) Task 3 steps to create a Service called `PingOne Worker AIC
` using the three ESVs which map to the PingOne Worker Credentials from the last section. After creating the configuration set the PingOne API Server URL and Authorization Server URL as per the address noted in the “Create a Worker Application” section

### Import the Custom Nodes

1. Download the Custom Nodes JSON [file](custom_nodes/Custom-Nodes.json) to your local machine/
2. From the P1AIC platform admin UI, expand Journeys on the left navigation panel > Custom Nodes
3. Click Import Nodes (or Import if other Custom Nodes are present) > Browse > open custom-nodes.json > Import Nodes > Done.

5 new Custom Nodes should import:

| Node | Purpose |
|------|----------|
| Get IDM User Attributes | Retrieves user attributes from IDM and stores in sharedState for later consumption|
| Debugger | Debug node to output contents of authentication state|
| nodeState Normalizer | Removes nodeState prefix values|
| Set BackChannel State Properties | Prepares the nodeState attributes to pass to the back channel journey|
| User Message to Display | Utility node to display a configurable message to the user|

### Journey import




## Example Usage

![Alt text](images/helpdesk_front_channel.png?raw=true "Helpdesk_Front_Channel Journey")

![Alt text](images/customer_back_channel.png?raw=true "Customer Back_Channel Journey")
