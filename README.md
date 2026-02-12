# aic_verified_helpdesk

NOTE - AWAITING RELEASE OF [AME-32579](https://pingidentity.atlassian.net/browse/AME-32579) TO INTRODUCE DYNAMIC FEEDBACK FOR FRONT CHANNEL UPDATES
---

## Introduction

This project provides a reference implementation of a Verified Helpdesk password reset pattern using PingOne Advanced Identity Cloud (P1AIC) integrated with PingOne Verify.

The solution separates the helpdesk and end-user experiences into two coordinated journeys:
* **HelpDeskResetWithP1Verify** – A noSession mustRun front-channel journey where a helpdesk operative authenticates, passes an admin role check, captures the customer’s email address, and initiates a secure back-channel transaction.
* **UserPasswordResetWithP1Verify** – A back-channel journey where the customer completes a PingOne Verify identity check before being allowed to reset their password.

The helpdesk journey securely invokes the user journey using a back-channel transaction, sends a magic link via a templated email, and polls for completion status. The user journey performs identity normalisation, optional PingOne user creation, QR-based PingOne Verify evaluation, and enforces retry limits before permitting a password reset.

This design ensures:
* Role-based control over helpdesk operations
* Strong identity verification before credential reset
* Clear separation of operator and customer flows
* Secure orchestration using P1AIC back-channel capabilities

The implementation is intended as a reusable blueprint for organisations seeking to modernise helpdesk password reset processes with high assurance identity verification.

---

## Dependencies

This project has the following dependencies:
* Creation of a helpdesk user where `frUnindexedString1` is set to a value of admin
* Creation of a customer user where a valid email address is set

---

## Setup Overview

To deploy this reference implementation, complete the following steps:

1. Set up a PingOne environment  
2. Create a Worker Application in the PingOne tenant  
3. Create the required Environment Secrets and Variables (ESVs) in P1AIC  
4. Import the custom nodes  
5. Import the journeys  
6. Configure an email template  
7. Test the implementation  

---

## Set Up a PingOne Environment

In this section, you will create a PingOne environment with **PingOne Verify** enabled.

1. If you have an existing PingOne subscription, sign in via the  
   [Ping Identity portal](https://www.pingidentity.com/en.html).
2. After successful login, you will be redirected to the PingOne Console  
   (for example, the [EU Console](https://console.pingone.eu)).
3. From the PingOne Console, select **Environments** from the left-hand navigation and click the **+** icon.
4. Choose **Build your own solution**, select **PingOne Verify**, and click **Next**.
5. Enter an environment name (for example:  
   `env-pingoneaic-mycompany-ew2-sandbox1`), select the region, and click **Finish**.
6. Expand Identity Verification > Verify Policies > Either duplicate the Default Verify Policy or Edit to set Data Matching Given Name and Family Name to MEDIUM Confidence Threshold and set to Required as below

![Verify Policy Configuration](images/verify_config.png?raw=true)

---

## Create a Worker Application in a P1AIC Tenant

1. Follow **Task 2** in the documentation below to create OIDC credentials for the PingOne AIC tenant:  
   [Create a Worker Application](https://docs.pingidentity.com/pingoneaic/integrations/pingone-set-up-workers.html#create-a-worker-application-in-each-mapped-pingone-environment)
2. Note the **PingOne API Server URL** and **Authorization Server URL**  
   (for example: `https://auth.pingone.com`, `https://auth.pingone.eu`).

---

## Create a PingOne Service in P1AIC

1. Follow **Task 3** in the documentation below to create the required Environment Secrets and Variables (ESVs):  
   [Create ESVs for Worker Credentials](https://docs.pingidentity.com/pingoneaic/integrations/pingone-set-up-workers.html#create-esvs-for-the-worker-application-credentials-in-each-tenant-environment)
2. Create a service named **PingOne Worker AIC** using the three ESVs mapped to the PingOne Worker credentials.
3. Configure the **PingOne API Server URL** and **Authorization Server URL** using the values noted in the previous section.

---

## Import Custom Nodes

1. Download the Custom Nodes JSON file:  
   [Custom-Nodes.json](custom_nodes/Custom-Nodes.json)
2. In the P1AIC Admin UI, navigate to **Journeys → Custom Nodes**.
3. Select **Import Nodes**, browse to the JSON file, and complete the import.

The following five Custom Nodes will be imported:

| Node | Purpose |
|-----|---------|
| Get IDM User Attributes | Retrieves user attributes from IDM and stores them in sharedState |
| Debugger | Outputs authentication state for debugging |
| nodeState Normalizer | Removes `nodeState` prefixes |
| Set BackChannel State Properties | Prepares attributes for the back-channel journey |
| User Message to Display | Displays configurable messages to the user |

---

## Import Journeys

1. Download the journey export file:  
   [P1AIC-HelpDesk-Journeys.json](journey_exports/P1AIC-HelpDesk-Journeys.json)
2. In the P1AIC Admin UI, navigate to **Journeys → Journeys → Import**.
3. Upload the JSON file and complete the import.

The following journeys will be created:

| Journey | Purpose |
|--------|---------|
| HelpDeskResetWithP1Verify | Front-channel helpdesk journey |
| UserPasswordResetWithP1Verify | Back-channel user verification and password reset journey |

### Journey Diagrams

**Front-Channel Helpdesk Journey**

![Helpdesk Front Channel](images/helpdesk_front_channel.png?raw=true)

**Back-Channel Customer Journey**

![Customer Back Channel](images/customer_back_channel.png?raw=true)

---

## Configure Email Template

Configure an email template using the following documentation:  
[PingOne AIC Email Templates](https://docs.pingidentity.com/pingoneaic/tenants/email-templates.html)

Key configuration values:
- **Template ID:** `verifyResetPassword`
- **Subject:** `Ping Identity Reset Password`
- **Email body:**

```md
### Verify email to reset password

Hi {{object.givenName}}

Click the link below to reset your password:

[Reset Password Link]({{object.resumeURI}})
```

---

## Testing

1. Launch the helpdesk journey in a non-default browser to avoid session clashes:
   ```text
   https://openam-<tenant>/am/XUI/?realm=alpha&authIndexType=service&authIndexValue=HelpDeskResetWithP1Verify
   ```
2. Log in as the helpdesk user and enter the end user’s email address.
   - The journey will poll until the back-channel flow completes.
3. The end user receives an email, completes the verification flow, and can then reset their password and access the system.

---

## Demo Video

Watch the full demo [here](https://youtu.be/mXLkD0dogEI)
