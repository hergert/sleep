
# Build a Remote MCP server · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/guides/remote-mcp-server/

## Metadata
- Depth: 0
- Timestamp: 2025-10-16T14:17:07.837198

## Content
Skip to content

Search
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Deploy your first MCP server 
 * Set up and deploy your MCP server via CLI 
 * Connect your Remote MCP server to Claude and other MCP Clients via a local proxy 
 * Add Authentication 
 * Step 1 — Create a new MCP server 
 * Step 2 — Create an OAuth App 
 * Next steps 

## On this page
 * Overview 
 * Deploy your first MCP server 
 * Set up and deploy your MCP server via CLI 
 * Connect your Remote MCP server to Claude and other MCP Clients via a local proxy 
 * Add Authentication 
 * Step 1 — Create a new MCP server 
 * Step 2 — Create an OAuth App 
 * Next steps 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Guides 
 5. Build a Remote MCP server 

Copy page
# Build a Remote MCP server
## Deploy your first MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-first-mcp-server)
This guide will show you how to deploy your own remote MCP server on Cloudflare, with two options:
 * **Without authentication** — anyone can connect and use the server (no login required).
 * **Withauthentication and authorization** — users sign in before accessing tools, and you can control which tools an agent can call based on the user's permissions.

You can start by deploying a public MCP server ↗ without authentication, then add user authentication and scoped authorization later. If you already know your server will require authentication, you can skip ahead to the next section.
The button below will guide you through everything you need to do to deploy this example MCP server ↗ to your Cloudflare account:

Once deployed, this server will be live at your workers.dev subdomain (e.g. remote-mcp-server-authless.your-account.workers.dev/sse). You can connect to it immediately using the AI Playground ↗ (a remote MCP client), MCP inspector ↗ or other MCP clients. Then, once you're ready, you can customize the MCP server and add your own tools.
If you're using the "Deploy to Cloudflare" button, a new git repository will be set up on your GitHub or GitLab account for your MCP server, configured to automatically deploy to Cloudflare each time you push a change or merge a pull request to the main branch of the repository. You can then clone this repository, develop locally, and start writing code and building.
### Set up and deploy your MCP server via CLI
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#set-up-and-deploy-your-mcp-server-via-cli)
Alternatively, you can use the command line as shown below to create a new MCP Server on your local machine.
 * 
 * 
 * 

Terminal window```


npmcreatecloudflare@latest--my-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Terminal window```


yarncreatecloudflaremy-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Terminal window```


pnpmcreatecloudflare@latestmy-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Now, you have the MCP server setup, with dependencies installed. Move into that project folder:
Terminal window```


cdmy-mcp-server


```

#### Local development
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#local-development)
In the directory of your new project, run the following command to start the development server:
Terminal window```


npmstart


```

Your MCP server is now running on `http://localhost:8788/sse`.
In a new terminal, run the MCP inspector ↗. The MCP inspector is an interactive MCP client that allows you to connect to your MCP server and invoke tools from a web browser.
Terminal window```


npx@modelcontextprotocol/inspector@latest


```

Open the MCP inspector in your web browser:
Terminal window```


openhttp://localhost:5173


```

In the inspector, enter the URL of your MCP server, `http://localhost:8788/sse`, and click **Connect**. You should see the "List Tools" button, which will list the tools that your MCP server exposes.
!MCP inspector — authenticated
#### Deploy your MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-mcp-server)
You can deploy your MCP server to Cloudflare using the following Wrangler CLI command within the example project:
Terminal window```


npxwrangler@latestdeploy


```

If you have already connected a git repository to the Worker with your MCP server, you can deploy your MCP server by pushing a change or merging a pull request to the main branch of the repository.
After deploying, take the URL of your deployed MCP server, and enter it in the MCP inspector running on `http://localhost:5173`. You now have a remote MCP server, deployed to Cloudflare, that MCP clients can connect to.
### Connect your Remote MCP server to Claude and other MCP Clients via a local proxy
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#connect-your-remote-mcp-server-to-claude-and-other-mcp-clients-via-a-local-proxy)
Now that your MCP server is running, you can use the `mcp-remote` local proxy ↗ to connect Claude Desktop or other MCP clients to it — even though these tools aren't yet _remote_ MCP clients, and don't support remote transport or authorization on the client side. This lets you test what an interaction with your MCP server will be like with a real MCP client.
Update your Claude Desktop configuration to point to the URL of your MCP server. You can use either the `localhost:8787/sse` URL, or the URL of your deployed MCP server:
```

{



"mcpServers":{




"math":{




"command":"npx",




"args":[




"mcp-remote",



"https://your-worker-name.your-account.workers.dev/sse"


]


}


}


}

```

Restart Claude Desktop after updating your config file to load the MCP Server. Once this is done, Claude will be able to make calls to your remote MCP server. You can test this by asking Claude to use one of your tools. For example: "Could you use the math tool to add 23 and 19?". Claude should invoke the tool and show the result generated by the MCP server.
Learn more about other ways of using remote MCP servers with MCP clients here in this section.
## Add Authentication
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication)
Now that you’ve deployed a public MCP server, let’s walk through how to enable user authentication using OAuth.
The public server example you deployed earlier allows any client to connect and invoke tools without logging in. To add authentication, you’ll update your MCP server to act as an OAuth provider, handling secure login flows and issuing access tokens that MCP clients can use to make authenticated tool calls.
This is especially useful if users already need to log in to use your service. Once authentication is enabled, users can sign in with their existing account and grant their AI agent permission to interact with the tools exposed by your MCP server, using scoped permissions.
In this example, we use GitHub as an OAuth provider, but you can connect your MCP server with any OAuth provider that supports the OAuth 2.0 specification, including Google, Slack, Stytch, Auth0, WorkOS, and more.
### Step 1 — Create a new MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#step-1--create-a-new-mcp-server)
Run the following command to create a new MCP server:
 * 
 * 
 * 

Terminal window```


npmcreatecloudflare@latest--my-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Terminal window```


yarncreatecloudflaremy-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Terminal window```


pnpmcreatecloudflare@latestmy-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Now, you have the MCP server setup, with dependencies installed. Move into that project folder:
Terminal window```


cdmy-mcp-server-github-auth


```

You'll notice that in the example MCP server, if you open `src/index.ts`, the primary difference is that the `defaultHandler` is set to the `GitHubHandler`:
TypeScript```


import GitHubHandler from "./github-handler";




exportdefaultnewOAuthProvider({




apiRoute:"/sse",




apiHandler:MyMCP.Router,




defaultHandler:GitHubHandler,




authorizeEndpoint:"/authorize",




tokenEndpoint:"/token",




clientRegistrationEndpoint:"/register",




});


```

This will ensure that your users are redirected to GitHub to authenticate. To get this working though, you need to create OAuth client apps in the steps below.
### Step 2 — Create an OAuth App
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#step-2--create-an-oauth-app)
You'll need to create two GitHub OAuth Apps ↗ to use GitHub as an authentication provider for your MCP server — one for local development, and one for production.
#### First create a new OAuth App for local development
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#first-create-a-new-oauth-app-for-local-development)
Navigate to github.com/settings/developers ↗ to create a new OAuth App with the following settings:
 * **Application name** : `My MCP Server (local)`
 * **Homepage URL** : `http://localhost:8788`
 * **Authorization callback URL** : `http://localhost:8788/callback`

For the OAuth app you just created, add the client ID of the OAuth app as `GITHUB_CLIENT_ID` and generate a client secret, adding it as `GITHUB_CLIENT_SECRET` to a `.dev.vars` file in the root of your project, which will be used to set secrets in local development.
Terminal window```


touch.dev.vars




echo'GITHUB_CLIENT_ID="your-client-id"'>>.dev.vars




echo'GITHUB_CLIENT_SECRET="your-client-secret"'>>.dev.vars




cat.dev.vars


```

#### Next, run your MCP server locally
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#next-run-your-mcp-server-locally)
Run the following command to start the development server:
Terminal window```


npmstart


```

Your MCP server is now running on `http://localhost:8788/sse`.
In a new terminal, run the MCP inspector ↗. The MCP inspector is an interactive MCP client that allows you to connect to your MCP server and invoke tools from a web browser.
Terminal window```


npx@modelcontextprotocol/inspector@latest


```

Open the MCP inspector in your web browser:
Terminal window```


openhttp://localhost:5173


```

In the inspector, set **Transport Type** to `SSE` and enter the URL of your MCP server, `http://localhost:8788/sse`
In the main panel on the right, click the **Open OAuth Settings** button and then click **Quick OAuth Flow**.
You should be redirected to a GitHub login or authorization page. After authorizing the MCP Client (the inspector) access to your GitHub account, you will be redirected back to the inspector.
Click **Connect** in the sidebar and you should see the "List Tools" button, which will list the tools that your MCP server exposes.
#### Second — create a new OAuth App for production
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#second-create-a-new-oauth-app-for-production)
You'll need to repeat these steps to create a new OAuth App for production.
Navigate to github.com/settings/developers ↗ to create a new OAuth App with the following settings:
 * **Application name** : `My MCP Server (production)`
 * **Homepage URL** : Enter the workers.dev URL of your deployed MCP server (ex: `worker-name.account-name.workers.dev`)
 * **Authorization callback URL** : Enter the `/callback` path of the workers.dev URL of your deployed MCP server (ex: `worker-name.account-name.workers.dev/callback`)

For the OAuth app you just created, add the client ID and client secret, using Wrangler CLI:
Terminal window```


wranglersecretputGITHUB_CLIENT_ID


```

Terminal window```


wranglersecretputGITHUB_CLIENT_SECRET


```

```

npx wrangler secret put COOKIE_ENCRYPTION_KEY # add any random string here e.g. openssl rand -hex 32

```

When you create the first secret, Wrangler will ask if you want to create a new Worker. Submit "Y" to create a new Worker and save the secret.
#### Set up a KV namespace
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#set-up-a-kv-namespace)
 * Create the KV namespace:

Terminal window```


npxwranglerkvnamespacecreate"OAUTH_KV"


```

 * Update the `wrangler.jsonc` file with the resulting KV ID:

```

{



"kvNamespaces":[



{



"binding":"OAUTH_KV",




"id":"<YOUR_KV_NAMESPACE_ID>"



}


]


}

```

#### Deploy your server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-server)
Deploy the MCP server to your Cloudflare `workers.dev` domain:
Terminal window```


npmrundeploy


```

#### Finally, connect to your MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#finally-connect-to-your-mcp-server)
Now that you've added the ID and secret of your production OAuth app, you should now be able to connect to your MCP server running at `worker-name.account-name.workers.dev/sse` using the AI Playground ↗, MCP inspector or (other MCP clients), and authenticate with GitHub.
## Next steps
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#next-steps)
 * Add tools to your MCP server.
 * Customize your MCP Server's authentication and authorization.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/guides/remote-mcp-server.mdx)
Last updated: Oct 8, 2025
 Previous 
Implement Effective Agent Patterns ↗ Next 
Test a Remote MCP Server 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Welcome to Cloudflare | Cloudflare Docs

## URL
https://developers.cloudflare.com

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.837428

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto

Directory Resources API Changelog
# Welcome to Cloudflare
Explore guides and tutorials to start building on Cloudflare's platform
Featured
 * Add web analytics 
 * Troubleshoot errors 
 * Register a domain 
 * Setup 1.1.1.1 
 * Get started with Cloudflare 

**View all docs **
Developer Products
 * Workers 
 * Pages 
 * R2 
 * Images 
 * Stream 

**View all developer products **
AI Products
 * AI Search 
 * Workers AI 
 * Vectorize 
 * AI Gateway 
 * AI Playground 

**View all AI products **
Zero Trust
 * Access 
 * Tunnel 
 * Gateway 
 * Browser Isolation 
 * Replace your VPN 

**View all Cloudflare One products **
* * *
## Build with Cloudflare
**Return HTML** **Return JSON** **Fetch HTML** **Redirect** **Respond with another site**
JavaScript```


exportdefault{




asyncfetch(request){




consthtml=`<!DOCTYPE html>



<body>


<h1>Hello World</h1>


<p>This markup was generated by a Cloudflare Worker.</p>



</body>`;




returnnewResponse(html,{




headers:{




"content-type":"text/html;charset=UTF-8",



},



});



},


};

```

Run Worker in Playground
JavaScript```


exportdefault{




asyncfetch(request){




constdata={




hello:"world",



};



returnResponse.json(data);



},


};

```

Run Worker in Playground
JavaScript```


exportdefault{




asyncfetch(request){



/**


* Replace `remote` with the host you wish to send requests to


*/



constremote="https://example.com";




returnawaitfetch(remote,request);



},


};

```

Run Worker in Playground
JavaScript```


exportdefault{




asyncfetch(request){




constdestinationURL="https://example.com";




conststatusCode=301;




returnResponse.redirect(destinationURL,statusCode);



},


};

```

Run Worker in Playground
JavaScript```


exportdefault{




asyncfetch(request){




asyncfunctionMethodNotAllowed(request){




returnnewResponse(`Method ${request.method} not allowed.`,{




status:405,




headers:{




Allow:"GET",



},



});



}


// Only GET requests work with this proxy.



if (request.method!=="GET") returnMethodNotAllowed(request);




returnfetch(`https://example.com`);



},


};

```

Run Worker in Playground
 Learn more about Workers 
* * *
!Developer Platform section image !Developer Platform section image
## Developer Platform
The Cloudflare Developer Platform provides a serverless execution environment that allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure.
 Explore our Developer Platform 
* * *
Install the WARP Client
The Cloudflare WARP client allows individuals and organizations to have a faster, more secure, and more private experience online.

 Get started 
Set up a tunnel
Cloudflare Tunnel provides you with a secure way to connect your resources to Cloudflare without a publicly routable IP address.

 Set up a tunnel 
!Zero Trust section image !Zero Trust section image
## Zero Trust
Cloudflare Zero Trust replaces legacy security perimeters with our global network, making the Internet faster and safer for teams around the world.
* * *
## Other docs you might also like
Install an Origin CA certificate
Use Origin Certificate Authority (CA) certificates to encrypt traffic between Cloudflare and your origin web server and reduce origin bandwidth.

 Install Origin CA 
Change your nameservers
Make Cloudflare your primary DNS provider by updating your authoritative nameservers at your domain registrar.

 Update nameservers 
SSL/TLS Encryption mode
Your domain's encryption mode controls how Cloudflare connects to your origin server and how SSL certificates at your origin will be validated.

 Set encryption mode 
Allow traffic from specific countries only
Block requests based on a list of allowed countries by configuring a custom rule in the Web Application Firewall (WAF).

 Allow traffic from specific countries only 
* * *
**Community**
Share ideas, answers, code and compare notes with the Cloudflare community.
 * Discord 
 * Twitter 
 * Community forum 

**Open source**
Cloudflare contributes to the open-source ecosystem in a variety of ways, including:
 * GitHub projects 
 * Sponsorship projects 
 * Style guide 

**Blog**
Get the latest news on Cloudflare products, technologies, and culture.
 * Read the blog 

 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Cloudflare Dashboard | Manage Your Account

## URL
https://dash.cloudflare.com

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.837461

## Content
# The Cloudflare dashboard is loading.


---

# Cloudflare Dashboard | Manage Your Account

## URL
https://deploy.workers.cloudflare.com?url=https%3A%2F%2Fgithub.com%2Fcloudflare%2Fai%2Ftree%2Fmain%2Fdemos%2Fremote-mcp-authless

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.837520

## Content
# The Cloudflare dashboard is loading.
!Company Logo
Your Opt Out Preference Signal is Honored
 * ### Your Privacy Choices
 * ### Advertising and Marketing Cookies
 * ### Functional Cookies
 * ### Strictly Necessary Cookies

#### Your Privacy Choices
Depending on your state of residence, including if you are a California resident, you have the right to opt out of certain sharing of personal information with third-party ad partners. We may share personal information with third-party ad partners, such as through cookies or by providing lists of email addresses for potential customers, so that we can reach them across the web with relevant ads. 

We also use Strictly Necessary Cookies that are essential for delivering our website experience to you safely and securely, and we use “Functional Cookies” that help the website work better for you (e.g., remember your login information or language preferences). You can opt out of Functional Cookies. 

In addition, we may also provide these marketing and advertising partners with your email address or other limited account information. You may opt out of such sharing by emailing us at sar@cloudflare.com. 

To learn more about the cookies we use on our site, please read our Cookie Policy. 
Cloudflare's Cookie Policy
#### Advertising and Marketing Cookies
Advertising and Marketing Cookies
Like many companies, Cloudflare uses services that help deliver interest-based ads to you and may transfer Personal Information to business partners for their use, including via advertising and marketing cookies. Making Personal Information (such as online identifiers or browsing activity) available to these companies may be considered a “sale” or “sharing” of your Personal Information under the CCPA or another U.S. state privacy law. Cloudflare does not sell your Personal Information in the conventional sense (i.e., for money). 

You can request to opt out of these cookies by toggling OFF the option to allow “Advertising and Marketing Cookies” above.
 * ##### Targeting Cookies
Switch Label
We use Targeting cookies to deliver advertisements relevant to you and your interests when you visit other websites that host advertisements. 

 * ##### Performance Cookies
Switch Label
Performance cookies help us learn how you use our website to help improve its performance and design. These cookies provide us with aggregated statistical information such as number of page visits, page load speeds, how long a user spends on a particular page, and the types of browsers or devices used to access our site. 

Cookies Details‎
#### Functional Cookies
Functional Cookies
Functional cookies allow us to remember choices you make about the kind of experience you want on our site and to provide you with a more personalized experience. For example, a functional cookie is required to remember which language you prefer. 
Cookies Details‎
#### Strictly Necessary Cookies
Always Active
Strictly Necessary cookies are essential to our website functioning as expected. You cannot turn off Strictly Necessary cookies because they are required to deliver security, enable core site functionality, and help you use our site's features and services as you would expect (including remembering your cookie consent preferences). Cloudflare does not use these cookies to track individuals across websites.
Cookies Details‎
Back Button
### Cookie List
Filter Button
Consent Leg.Interest
checkbox label label
checkbox label label
checkbox label label
Clear
 * checkbox label label

Apply Cancel
Confirm My Choices
Reject All But Necessary



---

# Certificate Transparency | Cloudflare Radar

## URL
https://ct.cloudflare.com

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.837677

## Content
Open menuCloudflare Radar
Search
Search for locations, autonomous systems, reports, domains and more...
Open toolbar
Language
English
Open toolbar
 * Overview
 * TrafficExpand
 * OverviewUpdated
 * Adoption & UsageUpdated
 * AI Insights
 * BotsExpand
 * Traffic
 * Directory
 * SecurityCollapse
 * Application Layer
 * Network Layer
 * Email
 * Certificate TransparencyNew
 * ConnectivityExpand
 * Internet Quality
 * Outage Center
 * RoutingUpdated
 * IP Address Information
 * DNSExpand
 * 1.1.1.1 Resolver
 * AS112 Project
 * Domain Rankings
 * Domain Information
 * Domain Categorization
 * ToolsExpand
 * Data Explorer
 * URL Scanner
 * Reports
 * APIExpand
 * Specification
 * Documentation
 * MCP Server
 * ResourcesExpand
 * About
 * Press
 * Glossary

Collapse sidebar
Info
The data presented here is derived from Certificate Transparency logs currently monitored by Cloudflare. Learn how CT monitoring works.
# Certificate Transparency
Location
Search for CT logs or CAs...
Date range:Last 7 days
## Certificate issuance volume
Copy link
Total number of certificates issued over the selected time period
Learn more...View in Data Explorer
* * *
### Entry type
Copy link
Unique
## Certificate characteristics
Copy link
Information on the technical makeup of certificates
### Public key algorithm
Copy link
Distribution of certificates by public key algorithm, reflecting the cryptographic methods used to establish secure connections
Learn more...View in Data Explorer
* * *
### Signature algorithm
Copy link
Distribution of certificates by signature algorithm, used by the issuer (CA) to sign the certificate
Learn more...View in Data Explorer
* * *
### Validation level
Copy link
Distribution of certificates by validation level, indicating the type of identity verification performed during issuance
Learn more...View in Data Explorer
* * *
### Certificate duration
Copy link
Distribution of certificate based on validity period (between NotBefore and NotAfter dates)
Learn more...View in Data Explorer
## Certificate issuance
Copy link
Certificate issuance is the process by which CAs generate digital certificates for domain owners. CAs are often operated by larger organizations, who may manage multiple subordinate CAs under a single corporate umbrella
### Certificate authority owners
Copy link
Distribution of certificate issuance across the top CA owners
Learn more...View in Data Explorer
* * *
### Certificate authorities
Copy link
Distribution of certificate issuance across the top CA certificates
Learn more...View in Data Explorer
Owner
Select...
## Certificate Transparency logs
Copy link
CT logs are "append-only" and publicly-auditable ledgers of certificates being created, updated, and expired
### CT log operators
Copy link
Distribution of certificates across CT log operators, identifying who manages the infrastructure behind CT logs
Learn more...View in Data Explorer
* * *
### CT log usage
Copy link
Distribution of certificates across CT logs
Learn more...View in Data Explorer
Operator
Select...
* * *
### CT log API
Copy link
Certificate submissions by log API
View in Data Explorer
## Certificate coverage
Copy link
A certificate can cover multiple top-level domains (TLDs), include wildcard entries, and support IP addresses in Subject Alternative Names (SANs)
### Certificate TLD distribution
Copy link
Distribution of pre-certificates across the top 10 top-level domains (TLDs)
Learn more...View in Data Explorer
* * *
### Wildcard usage
Copy link
Distribution of certificates that include wildcard entries
View in Data Explorer
### IP address inclusion
Copy link
Distribution of certificates that include IP addresses
View in Data Explorer
## Latest Certificates Transparency blog posts
Copy link
Posts tagged with "Certificates Transparency" from the Cloudflare blog
Cloudflare Blog
## Introducing new regional Internet traffic and Certificate Transparency insights on Cloudflare Radar
Cloudflare Radar now offers a Certificate Transparency dashboard for monitoring TLS certificate activity, and new regional traffic insights for a sub-national perspective on Internet trends. 
 * Birthday Week
 * Radar
 * Internet Traffic
 * Mobile
 * Certificate Transparency

David Belson, André Jesus, Luke Valenta
Sep 2025
## Addressing the unauthorized issuance of multiple TLS certificates for 1.1.1.1
Unauthorized TLS certificates were issued for 1.1.1.1 by a Certification Authority without permission from Cloudflare. These rogue certificates have now been revoked. 
 * 1.1.1.1
 * DNS
 * Resolver
 * DoH
 * TLS
 * Certificate Authority
 * Security
 * Certificate Transparency

Joe Abley, Thibault Meunier, Vicky Shrestha, Bas Westerbaan
Sep 2025
## A next-generation Certificate Transparency log built on Cloudflare Workers
Learn about recent developments in Certificate Transparency (CT), and how we built a next-generation CT log on top of Cloudflare's Developer Platform. 
 * Developer Week
 * Research
 * Open Source
 * Rust
 * Cloudflare Workers
 * Transparency
 * Certificate Transparency

Luke Valenta
Apr 2025
© 2025 Cloudflare, Inc.
Privacy PolicyTerms of UseDisclosureTrust & SafetyTrademarkSupport



---

# Run Workflows · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/run-workflows

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.837872

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Trigger a Workflow 
 * Trigger a Workflow from another project 

## On this page
 * Overview 
 * Trigger a Workflow 
 * Trigger a Workflow from another project 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Run Workflows 

Copy page
# Run Workflows
Agents can trigger asynchronous Workflows, allowing your Agent to run complex, multi-step tasks in the background. This can include post-processing files that a user has uploaded, updating the embeddings in a vector database, and/or managing long-running user-lifecycle email or SMS notification workflows.
Because an Agent is just like a Worker script, it can create Workflows defined in the same project (script) as the Agent _or_ in a different project.
Agents and Workflows have some similarities: they can both run tasks asynchronously. For straightforward tasks that are linear or need to run to completion, a Workflow can be ideal: steps can be retried, they can be cancelled, and can act on events.
Agents do not have to run to completion: they can loop, branch and run forever, and they can also interact directly with users (over HTTP or WebSockets). An Agent can be used to trigger multiple Workflows as it runs, and can thus be used to co-ordinate and manage Workflows to achieve its goals.
## Trigger a Workflow
[](https://developers.cloudflare.com/agents/api-reference/run-workflows/#trigger-a-workflow)
An Agent can trigger one or more Workflows from within any method, whether from an incoming HTTP request, a WebSocket connection, on a delay or schedule, and/or from any other action the Agent takes.
Triggering a Workflow from an Agent is no different from triggering a Workflow from a Worker script:
 * 
 * 

JavaScript```


exportclassMyAgentextendsAgent{




asynconRequest(request){




letuserId=request.headers.get("user-id");



// Trigger a schedule that runs a Workflow


// Pass it a payload



let{taskId}=awaitthis.schedule(300,"runWorkflow",{




id:userId,




flight:"DL264",




date:"2025-02-23",




});



}



asyncrunWorkflow(data){




letinstance=awaitenv.MY_WORKFLOW.create({




id:data.id,




params:data,




});



// Schedule another task that checks the Workflow status every 5 minutes...



awaitthis.schedule("*/5 * * * *","checkWorkflowStatus",{




id:instance.id,




});



}


}



exportclassMyWorkflowextendsWorkflowEntrypoint{




asyncrun(event,step){



// Your Workflow code here


}


}

```

TypeScript```


interfaceEnv{




MY_WORKFLOW:Workflow;




MyAgent:AgentNamespace<MyAgent>;



}



exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){




letuserId=request.headers.get("user-id");



// Trigger a schedule that runs a Workflow


// Pass it a payload



let{taskId}=awaitthis.schedule(300,"runWorkflow",{ id:userId, flight:"DL264", date:"2025-02-23"});



}



asyncrunWorkflow(data){




letinstance=awaitenv.MY_WORKFLOW.create({




id:data.id,




params:data,




})



// Schedule another task that checks the Workflow status every 5 minutes...



awaitthis.schedule("*/5 * * * *","checkWorkflowStatus",{ id:instance.id});



}


}



exportclassMyWorkflowextendsWorkflowEntrypoint<Env>{




asyncrun(event:WorkflowEvent<Params>,step:WorkflowStep){



// Your Workflow code here


}


}

```

You'll also need to make sure your Agent has a binding to your Workflow so that it can call it:
 * 
 * 

```

{


// ...


// Create a binding between your Agent and your Workflow



"workflows":[



{


// Required:



"name":"EMAIL_WORKFLOW",




"class_name":"MyWorkflow",



// Optional: set the script_name field if your Workflow is defined in a


// different project from your Agent



"script_name":"email-workflows"



}


],


// ...


}

```

```


[[workflows]]




name="EMAIL_WORKFLOW"




class_name="MyWorkflow"




script_name="email-workflows"


```

## Trigger a Workflow from another project
[](https://developers.cloudflare.com/agents/api-reference/run-workflows/#trigger-a-workflow-from-another-project)
You can also call a Workflow that is defined in a different Workers script from your Agent by setting the `script_name` property in the `workflows` binding of your Agent:
 * 
 * 

```

{


// Required:



"name":"EMAIL_WORKFLOW",




"class_name":"MyWorkflow",



// Optional: set the script_name field if your Workflow is defined in a


// different project from your Agent



"script_name":"email-workflows"



}

```

```


name="EMAIL_WORKFLOW"




class_name="MyWorkflow"




script_name="email-workflows"


```

Refer to the cross-script calls section of the Workflows documentation for more examples.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/run-workflows.mdx)
Last updated: May 14, 2025
 Previous 
Schedule tasks Next 
Store and sync state 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Using WebSockets · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/websockets

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.838136

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Connecting clients 
 * React clients 
 * Handling WebSocket events 

## On this page
 * Overview 
 * Connecting clients 
 * React clients 
 * Handling WebSocket events 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Using WebSockets 

Copy page
# Using WebSockets
Users and clients can connect to an Agent directly over WebSockets, allowing long-running, bi-directional communication with your Agent as it operates.
To enable an Agent to accept WebSockets, define `onConnect` and `onMessage` methods on your Agent.
 * `onConnect(connection: Connection, ctx: ConnectionContext)` is called when a client establishes a new WebSocket connection. The original HTTP request, including request headers, cookies, and the URL itself, are available on `ctx.request`.
 * `onMessage(connection: Connection, message: WSMessage)` is called for each incoming WebSocket message. Messages are one of `ArrayBuffer | ArrayBufferView | string`, and you can send messages back to a client using `connection.send()`. You can distinguish between client connections by checking `connection.id`, which is unique for each connected client.

Here's an example of an Agent that echoes back any message it receives:
 * 
 * 

JavaScript```


import {Agent,Connection} from "agents";




exportclassChatAgentextendsAgent{




asynconConnect(connection,ctx){



// Connections are automatically accepted by the SDK.


// You can also explicitly close a connection here with connection.close()


// Access the Request on ctx.request to inspect headers, cookies and the URL


}



asynconMessage(connection,message){



// const response = await longRunningAITask(message)



awaitconnection.send(message);



}


}

```

TypeScript```


import {Agent,Connection} from "agents";




exportclassChatAgentextendsAgent{




asynconConnect(connection:Connection,ctx:ConnectionContext){



// Connections are automatically accepted by the SDK.


// You can also explicitly close a connection here with connection.close()


// Access the Request on ctx.request to inspect headers, cookies and the URL


}



asynconMessage(connection:Connection,message:WSMessage){



// const response = await longRunningAITask(message)



awaitconnection.send(message)



}


}

```

### Connecting clients
[](https://developers.cloudflare.com/agents/api-reference/websockets/#connecting-clients)
The Agent framework includes a useful helper package for connecting directly to your Agent (or other Agents) from a client application. Import `agents/client`, create an instance of `AgentClient` and use it to connect to an instance of your Agent:
 * 
 * 

JavaScript```


import {AgentClient} from "agents/client";




constconnection=newAgentClient({




agent:"dialogue-agent",




name:"insight-seeker",




});




connection.addEventListener("message",(event)=>{




console.log("Received:",event.data);




});




connection.send(




JSON.stringify({




type:"inquiry",




content:"What patterns do you see?",




}),




);


```

TypeScript```


import {AgentClient} from "agents/client";




constconnection=newAgentClient({




agent:"dialogue-agent",




name:"insight-seeker",




});




connection.addEventListener("message",(event)=>{




console.log("Received:",event.data);




});




connection.send(




JSON.stringify({




type:"inquiry",




content:"What patterns do you see?",




})




);


```

### React clients
[](https://developers.cloudflare.com/agents/api-reference/websockets/#react-clients)
React-based applications can import `agents/react` and use the `useAgent` hook to connect to an instance of an Agent directly:
 * 
 * 

JavaScript```


import {useAgent} from "agents/react";




functionAgentInterface(){




constconnection=useAgent({




agent:"dialogue-agent",




name:"insight-seeker",




onMessage:(message)=>{




console.log("Understanding received:",message.data);



},



onOpen:()=>console.log("Connection established"),




onClose:()=>console.log("Connection closed"),




});




constinquire=()=>{




connection.send(




JSON.stringify({




type:"inquiry",




content:"What insights have you gathered?",




}),




);



};



return (




<divclassName="agent-interface">




<buttononClick={inquire}>Seek Understanding</button>




</div>




);



}

```

TypeScript```


import {useAgent} from "agents/react";




functionAgentInterface(){




constconnection=useAgent({




agent:"dialogue-agent",




name:"insight-seeker",




onMessage:(message)=>{




console.log("Understanding received:",message.data);



},



onOpen:()=>console.log("Connection established"),




onClose:()=>console.log("Connection closed"),




});




constinquire=()=>{




connection.send(




JSON.stringify({




type:"inquiry",




content:"What insights have you gathered?",




})




);



};



return (




<divclassName="agent-interface">




<buttononClick={inquire}>SeekUnderstanding</button>



</div>



);



}

```

The `useAgent` hook automatically handles the lifecycle of the connection, ensuring that it is properly initialized and cleaned up when the component mounts and unmounts. You can also combine `useAgent` with `useState` to automatically synchronize state across all clients connected to your Agent.
### Handling WebSocket events
[](https://developers.cloudflare.com/agents/api-reference/websockets/#handling-websocket-events)
Define `onError` and `onClose` methods on your Agent to explicitly handle WebSocket client errors and close events. Log errors, clean up state, and/or emit metrics:
 * 
 * 

JavaScript```


import {Agent,Connection} from "agents";




exportclassChatAgentextendsAgent{



// onConnect and onMessage methods


// ...


// WebSocket error and disconnection (close) handling.



asynconError(connection,error){




console.error(`WS error: ${error}`);



}



asynconClose(connection,code,reason,wasClean){




console.log(`WS closed: ${code} - ${reason} - wasClean: ${wasClean}`);




connection.close();



}


}

```

TypeScript```


import {Agent,Connection} from "agents";




exportclassChatAgentextendsAgent{



// onConnect and onMessage methods


// ...


// WebSocket error and disconnection (close) handling.



asynconError(connection:Connection,error:unknown):Promise<void>{




console.error(`WS error: ${error}`);



}



asynconClose(connection:Connection,code:number,reason:string,wasClean:boolean):Promise<void>{




console.log(`WS closed: ${code} - ${reason} - wasClean: ${wasClean}`);




connection.close();



}


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/websockets.mdx)
Last updated: Mar 18, 2025
 Previous 
Retrieval Augmented Generation Next 
Configuration 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# HTTP and Server-Sent Events · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/http-sse

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.838394

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Handling HTTP requests 
 * Implementing Server-Sent Events 
 * WebSockets vs. Server-Sent Events 
 * Next steps 

## On this page
 * Overview 
 * Handling HTTP requests 
 * Implementing Server-Sent Events 
 * WebSockets vs. Server-Sent Events 
 * Next steps 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. HTTP and Server-Sent Events 

Copy page
# HTTP and Server-Sent Events
The Agents SDK allows you to handle HTTP requests and has native support for Server-Sent Events ↗ (SSE). This allows you build applications that can push data to clients and avoid buffering.
### Handling HTTP requests
[](https://developers.cloudflare.com/agents/api-reference/http-sse/#handling-http-requests)
Agents can handle HTTP requests using the `onRequest` method, which is called whenever an HTTP request is received by the Agent instance. The method takes a `Request` object as a parameter and returns a `Response` object.
 * 
 * 

JavaScript```


classMyAgentextendsAgent{



// Handle HTTP requests coming to this Agent instance


// Returns a Response object



asynconRequest(request){




returnnewResponse("Hello from Agent!");



}



asynccallAIModel(prompt){



// Implement AI model call here


}


}

```

TypeScript```


classMyAgentextendsAgent<Env,State>{



// Handle HTTP requests coming to this Agent instance


// Returns a Response object



asynconRequest(request:Request){




returnnewResponse("Hello from Agent!");



}



asynccallAIModel(prompt:string){



// Implement AI model call here


}


}

```

Review the Agents API reference to learn more about the `Agent` class and its methods.
### Implementing Server-Sent Events
[](https://developers.cloudflare.com/agents/api-reference/http-sse/#implementing-server-sent-events)
The Agents SDK support Server-Sent Events directly: you can use SSE to stream data back to the client over a long running connection. This avoids buffering large responses, which can both make your Agent feel slow, and forces you to buffer the entire response in memory.
When an Agent is deployed to Cloudflare Workers, there is no effective limit on the total time it takes to stream the response back: large AI model responses that take several minutes to reason and then respond will not be prematurely terminated.
Note that this does not mean the client can't potentially disconnect during the streaming process: you can account for this by either writing to the Agent's stateful storage and/or using WebSockets. Because you can always route to the same Agent, you do not need to use a centralized session store to pick back up where you left off when a client disconnects.
The following example uses the AI SDK to generate text and stream it back to the client. It will automatically stream the response back to the client as the model generates it:
 * 
 * 

JavaScript```


import {




Agent,




AgentNamespace,




getAgentByName,




routeAgentRequest,




} from "agents";




import {streamText} from "ai";




import {createOpenAI,openai} from "@ai-sdk/openai";




exportclassMyAgentextendsAgent{




asynconRequest(request){



// Test it via:


// curl -d '{"prompt": "Write me a Cloudflare Worker"}' <url>



letdata=awaitrequest.json();




letstream=awaitthis.callAIModel(data.prompt);



// This uses Server-Sent Events (SSE)



returnstream.toTextStreamResponse({




headers:{




"Content-Type":"text/x-unknown",




"content-encoding":"identity",




"transfer-encoding":"chunked",



},



});



}



asynccallAIModel(prompt){




constopenai=createOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




returnstreamText({




model:openai("gpt-4o"),




prompt:prompt,




});



}


}



exportdefault{




asyncfetch(request,env){




letagentId=newURL(request.url).searchParams.get("agent-id") ||"";




constagent=awaitgetAgentByName(env.MyAgent,agentId);




returnagent.fetch(request);



},


};

```

TypeScript```


import {Agent,AgentNamespace,getAgentByName,routeAgentRequest} from 'agents';




import {streamText} from 'ai';




import {createOpenAI,openai} from '@ai-sdk/openai';




interfaceEnv{




MyAgent:AgentNamespace<MyAgent>;




OPENAI_API_KEY:string;



}



exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){



// Test it via:


// curl -d '{"prompt": "Write me a Cloudflare Worker"}' <url>



letdata=awaitrequest.json<{prompt:string}>();




letstream=awaitthis.callAIModel(data.prompt);



// This uses Server-Sent Events (SSE)



returnstream.toTextStreamResponse({




headers:{




'Content-Type':'text/x-unknown',




'content-encoding':'identity',




'transfer-encoding':'chunked',



},



});



}



asynccallAIModel(prompt:string){




constopenai=createOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




returnstreamText({




model:openai('gpt-4o'),




prompt:prompt,




});



}


}



exportdefault{




asyncfetch(request:Request,env:Env){




letagentId=newURL(request.url).searchParams.get('agent-id') ||'';




constagent=awaitgetAgentByName<Env,MyAgent>(env.MyAgent,agentId);




returnagent.fetch(request);



},


};

```

### WebSockets vs. Server-Sent Events
[](https://developers.cloudflare.com/agents/api-reference/http-sse/#websockets-vs-server-sent-events)
Both WebSockets and Server-Sent Events (SSE) enable real-time communication between clients and Agents. Agents built on the Agents SDK can expose both WebSocket and SSE endpoints directly.
 * WebSockets provide full-duplex communication, allowing data to flow in both directions simultaneously. SSE only supports server-to-client communication, requiring additional HTTP requests if the client needs to send data back.
 * WebSockets establish a single persistent connection that stays open for the duration of the session. SSE, being built on HTTP, may experience more overhead due to reconnection attempts and header transmission with each reconnection, especially when there is a lot of client-server communication.
 * While SSE works well for simple streaming scenarios, WebSockets are better suited for applications requiring minutes or hours of connection time, as they maintain a more stable connection with built-in ping/pong mechanisms to keep connections alive.
 * WebSockets use their own protocol (ws:// or wss://), separating them from HTTP after the initial handshake. This separation allows WebSockets to better handle binary data transmission and implement custom subprotocols for specialized use cases.

If you're unsure of which is better for your use-case, we recommend WebSockets. The WebSockets API documentation provides detailed information on how to use WebSockets with the Agents SDK.
### Next steps
[](https://developers.cloudflare.com/agents/api-reference/http-sse/#next-steps)
 * Review the API documentation for the Agents class to learn how to define them.
 * Build a chat Agent using the Agents SDK and deploy it to Workers.
 * Learn more using WebSockets to build interactive Agents and stream data back from your Agent.
 * Orchestrate asynchronous workflows from your Agent by combining the Agents SDK and Workflows.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/http-sse.mdx)
Last updated: Mar 18, 2025
 Previous 
Browse the web Next 
Retrieval Augmented Generation 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Retrieval Augmented Generation · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/rag

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.838644

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Vector search 

## On this page
 * Overview 
 * Vector search 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Retrieval Augmented Generation 

Copy page
# Retrieval Augmented Generation
Agents can use Retrieval Augmented Generation (RAG) to retrieve relevant information and use it augment calls to AI models. Store a user's chat history to use as context for future conversations, summarize documents to bootstrap an Agent's knowledge base, and/or use data from your Agent's web browsing tasks to enhance your Agent's capabilities.
You can use the Agent's own SQL database as the source of truth for your data and store embeddings in Vectorize (or any other vector-enabled database) to allow your Agent to retrieve relevant information.
### Vector search
[](https://developers.cloudflare.com/agents/api-reference/rag/#vector-search)
If you're brand-new to vector databases and Vectorize, visit the Vectorize tutorial to learn the basics, including how to create an index, insert data, and generate embeddings.
You can query a vector index (or indexes) from any method on your Agent: any Vectorize index you attach is available on `this.env` within your Agent. If you've associated metadata with your vectors that maps back to data stored in your Agent, you can then look up the data directly within your Agent using `this.sql`.
Here's an example of how to give an Agent retrieval capabilities:
 * 
 * 

JavaScript```


import {Agent} from "agents";




exportclassRAGAgentextendsAgent{



// Other methods on our Agent


// ...


//



asyncqueryKnowledge(userQuery){



// Turn a query into an embedding



constqueryVector=awaitthis.env.AI.run("@cf/baai/bge-base-en-v1.5",{




text: [userQuery],




});



// Retrieve results from our vector index



letsearchResults=awaitthis.env.VECTOR_DB.query(queryVector.data[0],{




topK:10,




returnMetadata:"all",




});




letknowledge= [];




for (constmatchofsearchResults.matches) {




console.log(match.metadata);




knowledge.push(match.metadata);



}


// Use the metadata to re-associate the vector search results


// with data in our Agent's SQL database



letresults=this




.sql`SELECT * FROM knowledge WHERE id IN (${knowledge.map((k)=>k.id)})`;



// Return them



returnresults;



}


}

```

TypeScript```


import {Agent} from "agents";




interfaceEnv{




AI:Ai;




VECTOR_DB:Vectorize;



}



exportclassRAGAgentextendsAgent<Env>{



// Other methods on our Agent


// ...


//



asyncqueryKnowledge(userQuery:string){



// Turn a query into an embedding



constqueryVector=awaitthis.env.AI.run('@cf/baai/bge-base-en-v1.5',{




text: [userQuery],




});



// Retrieve results from our vector index



letsearchResults=awaitthis.env.VECTOR_DB.query(queryVector.data[0],{




topK:10,




returnMetadata:'all',




});




letknowledge= [];




for (constmatchofsearchResults.matches) {




console.log(match.metadata);




knowledge.push(match.metadata);



}


// Use the metadata to re-associate the vector search results


// with data in our Agent's SQL database



letresults=this.sql`SELECT * FROM knowledge WHERE id IN (${knowledge.map((k)=>k.id)})`;



// Return them



returnresults;



}


}

```

You'll also need to connect your Agent to your vector indexes:
 * 
 * 

```

{


// ...



"vectorize":[



{



"binding":"VECTOR_DB",




"index_name":"your-vectorize-index-name"



}


]


// ...


}

```

```


[[vectorize]]




binding="VECTOR_DB"




index_name="your-vectorize-index-name"


```

If you have multiple indexes you want to make available, you can provide an array of `vectorize` bindings.
#### Next steps
[](https://developers.cloudflare.com/agents/api-reference/rag/#next-steps)
 * Learn more on how to combine Vectorize and Workers AI
 * Review the Vectorize query API
 * Use metadata filtering to add context to your results

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/rag.mdx)
Last updated: May 14, 2025
 Previous 
HTTP and Server-Sent Events Next 
Using WebSockets 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Store and sync state · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/store-and-sync-state

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839051

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Set the initial state for an Agent 
 * Synchronizing state 
 * SQL API 
 * Use Agent state as model context 
 * Next steps 

## On this page
 * Overview 
 * Set the initial state for an Agent 
 * Synchronizing state 
 * SQL API 
 * Use Agent state as model context 
 * Next steps 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Store and sync state 

Copy page
# Store and sync state
Every Agent has built-in state management capabilities, including built-in storage and synchronization between the Agent and frontend applications.
State within an Agent is:
 * Persisted across Agent restarts: data is permanently stored within an Agent.
 * Automatically serialized/deserialized: you can store any JSON-serializable data.
 * Immediately consistent within the Agent: read your own writes.
 * Thread-safe for concurrent updates
 * Fast: state is colocated wherever the Agent is running. Reads and writes do not need to traverse the network.

Agent state is stored in a SQL database that is embedded within each individual Agent instance: you can interact with it using the higher-level `this.setState` API (recommended), which allows you to sync state and trigger events on state changes, or by directly querying the database with `this.sql`.
#### State API
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#state-api)
Every Agent has built-in state management capabilities. You can set and update the Agent's state directly using `this.setState`:
 * 
 * 

JavaScript```


import {Agent} from "agents";




exportclassMyAgentextendsAgent{



// Update state in response to events



asyncincrementCounter(){




this.setState({




...this.state,




counter:this.state.counter+1,




});



}


// Handle incoming messages



asynconMessage(message){




if (message.type==="update") {




this.setState({




...this.state,




...message.data,




});



}


}


// Handle state updates



onStateUpdate(state,source){




console.log("state updated",state);



}


}

```

TypeScript```


import {Agent} from "agents";




exportclassMyAgentextendsAgent{



// Update state in response to events



asyncincrementCounter(){




this.setState({




...this.state,




counter:this.state.counter+1,




});



}


// Handle incoming messages



asynconMessage(message){




if (message.type==="update") {




this.setState({




...this.state,




...message.data,




});



}


}


// Handle state updates



onStateUpdate(state,source:"server"|Connection){




console.log("state updated",state);



}


}

```

If you're using TypeScript, you can also provide a type for your Agent's state by passing in a type as a type parameter ↗ as the _second_ type parameter to the `Agent` class definition.
 * 
 * 

JavaScript```


import {Agent} from "agents";



// Define a type for your Agent's state


// Pass in the type of your Agent's state



exportclassMyAgentextendsAgent{



// This allows this.setState and the onStateUpdate method to


// be typed:



asynconStateUpdate(state){




console.log("state updated",state);



}



asyncsomeOtherMethod(){




this.setState({




...this.state,




price:this.state.price+10,




});



}


}

```

TypeScript```


import {Agent} from "agents";




interfaceEnv{}



// Define a type for your Agent's state



interfaceFlightRecord{




id:string;




departureIata:string;




arrival:Date;




arrivalIata:string;




price:number;



}


// Pass in the type of your Agent's state



exportclassMyAgentextendsAgent<Env,FlightRecord>{



// This allows this.setState and the onStateUpdate method to


// be typed:



asynconStateUpdate(state:FlightRecord){




console.log("state updated",state);



}



asyncsomeOtherMethod(){




this.setState({




...this.state,




price:this.state.price+10,




});



}


}

```

### Set the initial state for an Agent
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#set-the-initial-state-for-an-agent)
You can also set the initial state for an Agent via the `initialState` property on the `Agent` class:
 * 
 * 

JavaScript```


classMyAgentextendsAgent{



// Set a default, initial state



initialState ={




counter:0,




text:"",




color:"#3B82F6",



};



doSomething(){




console.log(this.state);// {counter: 0, text: "", color: "#3B82F6"}, if you haven't set the state yet



}


}

```

TypeScript```


typeState={




counter:number;




text:string;




color:string;



};



classMyAgentextendsAgent<Env,State>{



// Set a default, initial state



initialState ={




counter:0,




text:"",




color:"#3B82F6",



};



doSomething(){




console.log(this.state);// {counter: 0, text: "", color: "#3B82F6"}, if you haven't set the state yet



}


}

```

Any initial state is synced to clients connecting via the `useAgent` hook.
### Synchronizing state
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#synchronizing-state)
Clients can connect to an Agent and stay synchronized with its state using the React hooks provided as part of `agents/react`.
A React application can call `useAgent` to connect to a named Agent over WebSockets at
 * 
 * 

JavaScript```


import {useState} from "react";




import {useAgent} from "agents/react";




functionStateInterface(){




const[state,setState]=useState({ counter:0});




constagent=useAgent({




agent:"thinking-agent",




name:"my-agent",




onStateUpdate:(newState)=>setState(newState),




});




constincrement=()=>{




agent.setState({ counter:state.counter+1});



};



return (




<div>




<div>Count: {state.counter}</div>




<buttononClick={increment}>Increment</button>




</div>




);



}

```

TypeScript```


import {useState} from "react";




import {useAgent} from "agents/react";




functionStateInterface(){




const[state,setState]=useState({ counter:0});




constagent=useAgent({




agent:"thinking-agent",




name:"my-agent",




onStateUpdate:(newState)=>setState(newState),




});




constincrement=()=>{




agent.setState({ counter:state.counter+1});



};



return (




<div>




<div>Count:{state.counter}</div>




<buttononClick={increment}>Increment</button>



</div>



);



}

```

The state synchronization system:
 * Automatically syncs the Agent's state to all connected clients
 * Handles client disconnections and reconnections gracefully
 * Provides immediate local updates
 * Supports multiple simultaneous client connections

Common use cases:
 * Real-time collaborative features
 * Multi-window/tab synchronization
 * Live updates across multiple devices
 * Maintaining consistent UI state across clients
 * When new clients connect, they automatically receive the current state from the Agent, ensuring all clients start with the latest data.

### SQL API
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#sql-api)
Every individual Agent instance has its own SQL (SQLite) database that runs _within the same context_ as the Agent itself. This means that inserting or querying data within your Agent is effectively zero-latency: the Agent doesn't have to round-trip across a continent or the world to access its own data.
You can access the SQL API within any method on an Agent via `this.sql`. The SQL API accepts template literals, and
 * 
 * 

JavaScript```


exportclassMyAgentextendsAgent{




asynconRequest(request){




letuserId=newURL(request.url).searchParams.get("userId");



// 'users' is just an example here: you can create arbitrary tables and define your own schemas


// within each Agent's database using SQL (SQLite syntax).



letuser=awaitthis.sql`SELECT * FROM users WHERE id = ${userId}`;




returnResponse.json(user);



}


}

```

TypeScript```


exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){




letuserId=newURL(request.url).searchParams.get('userId');



// 'users' is just an example here: you can create arbitrary tables and define your own schemas


// within each Agent's database using SQL (SQLite syntax).



letuser=awaitthis.sql`SELECT * FROM users WHERE id = ${userId}`




returnResponse.json(user)



}


}

```

You can also supply a TypeScript type argument ↗ to the query, which will be used to infer the type of the result:
TypeScript```


typeUser={




id:string;




name:string;




email:string;



};



exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){




letuserId=newURL(request.url).searchParams.get('userId');



// Supply the type parameter to the query when calling this.sql


// This assumes the results returns one or more User rows with "id", "name", and "email" columns



constuser=awaitthis.sql<User>`SELECT * FROM users WHERE id = ${userId}`;




returnResponse.json(user)



}


}

```

You do not need to specify an array type (`User[]` or `Array<User>`) as `this.sql` will always return an array of the specified type.
Providing a type parameter does not validate that the result matches your type definition. In TypeScript, properties (fields) that do not exist or conform to the type you provided will be dropped. If you need to validate incoming events, we recommend a library such as zod ↗ or your own validator logic.
Learn more about the zero-latency SQL storage that powers both Agents and Durable Objects on our blog ↗.
The SQL API exposed to an Agent is similar to the one within Durable Objects: Durable Object SQL methods available on `this.ctx.storage.sql`. You can use the same SQL queries with the Agent's database, create tables, and query data, just as you would with Durable Objects or D1.
### Use Agent state as model context
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#use-agent-state-as-model-context)
You can combine the state and SQL APIs in your Agent with its ability to call AI models to include historical context within your prompts to a model. Modern Large Language Models (LLMs) often have very large context windows (up to millions of tokens), which allows you to pull relevant context into your prompt directly.
For example, you can use an Agent's built-in SQL database to pull history, query a model with it, and append to that history ahead of the next call to the model:
 * 
 * 

JavaScript```


exportclassReasoningAgentextendsAgent{




asynccallReasoningModel(prompt){




letresult=this




.sql`SELECT * FROM history WHERE user = ${prompt.userId} ORDER BY timestamp DESC LIMIT 1000`;




letcontext= [];




forawait (constrowofresult) {




context.push(row.entry);



}



constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});



// Combine user history with the current prompt



constsystemPrompt=prompt.system||"You are a helpful assistant.";




constuserPrompt=`${prompt.user}\n\nUser history:\n${context.join("\n")}`;




try{




constcompletion=awaitclient.chat.completions.create({




model:this.env.MODEL||"o3-mini",




messages: [




{ role:"system", content:systemPrompt},




{ role:"user", content:userPrompt},




],




temperature:0.7,




max_tokens:1000,




});



// Store the response in history


this



.sql`INSERT INTO history (timestamp, user, entry) VALUES (${newDate()}, ${prompt.userId}, ${completion.choices[0].message.content})`;




returncompletion.choices[0].message.content;




}catch (error) {




console.error("Error calling reasoning model:",error);




throwerror;



}


}


}

```

TypeScript```


exportclassReasoningAgentextendsAgent<Env>{




asynccallReasoningModel(prompt:Prompt){




letresult=this.sql<History>`SELECT * FROM history WHERE user = ${prompt.userId} ORDER BY timestamp DESC LIMIT 1000`;




letcontext= [];




forawait (constrowofresult) {




context.push(row.entry);



}



constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});



// Combine user history with the current prompt



constsystemPrompt=prompt.system||'You are a helpful assistant.';




constuserPrompt=`${prompt.user}\n\nUser history:\n${context.join('\n')}`;




try{




constcompletion=awaitclient.chat.completions.create({




model:this.env.MODEL||'o3-mini',




messages: [




{ role:'system', content:systemPrompt},




{ role:'user', content:userPrompt},




],




temperature:0.7,




max_tokens:1000,




});



// Store the response in history


this



.sql`INSERT INTO history (timestamp, user, entry) VALUES (${newDate()}, ${prompt.userId}, ${completion.choices[0].message.content})`;




returncompletion.choices[0].message.content;




}catch (error) {




console.error('Error calling reasoning model:',error);




throwerror;



}


}


}

```

This works because each instance of an Agent has its _own_ database, the state stored in that database is private to that Agent: whether it's acting on behalf of a single user, a room or channel, or a deep research tool. By default, you don't have to manage contention or reach out over the network to a centralized database to retrieve and store state.
### Next steps
[](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/#next-steps)
 * Review the API documentation for the Agents class to learn how to define them.
 * Build a chat Agent using the Agents SDK and deploy it to Workers.
 * Learn more using WebSockets to build interactive Agents and stream data back from your Agent.
 * Orchestrate asynchronous workflows from your Agent by combining the Agents SDK and Workflows.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/store-and-sync-state.mdx)
Last updated: Sep 24, 2025
 Previous 
Run Workflows Next 
Browse the web 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Discord

## URL
http://discord.cloudflare.com

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839106

## Content
,
,
Reactions
click to open image dialog


---

# API Reference · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839213

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 

## On this page
 * Overview 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 

Copy page
# API Reference
Learn more about what Agents can do, the `Agent` class, and the APIs that Agents expose:
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/index.mdx)
Last updated: Mar 18, 2025
 Previous 
Calling LLMs Next 
Agents API 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Schedule tasks · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/schedule-tasks

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839397

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Scheduling tasks 
 * Managing scheduled tasks 

## On this page
 * Overview 
 * Scheduling tasks 
 * Managing scheduled tasks 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Schedule tasks 

Copy page
# Schedule tasks
An Agent can schedule tasks to be run in the future by calling `this.schedule(when, callback, data)`, where `when` can be a delay, a `Date`, or a cron string; `callback` the function name to call, and `data` is an object of data to pass to the function.
Scheduled tasks can do anything a request or message from a user can: make requests, query databases, send emails, read+write state: scheduled tasks can invoke any regular method on your Agent.
### Scheduling tasks
[](https://developers.cloudflare.com/agents/api-reference/schedule-tasks/#scheduling-tasks)
You can call `this.schedule` within any method on an Agent, and schedule tens-of-thousands of tasks per individual Agent:
 * 
 * 

JavaScript```


import {Agent} from "agents";




exportclassSchedulingAgentextendsAgent{




asynconRequest(request){



// Handle an incoming request


// Schedule a task 10 minutes from now


// Calls the "checkFlights" method



let{taskId}=awaitthis.schedule(600,"checkFlights",{




flight:"DL264",




date:"2025-02-23",




});




returnResponse.json({taskId});



}



asynccheckFlights(data){



// Invoked when our scheduled task runs


// We can also call this.schedule here to schedule another task


}


}

```

TypeScript```


import {Agent} from "agents"




exportclassSchedulingAgentextendsAgent{




asynconRequest(request){



// Handle an incoming request


// Schedule a task 10 minutes from now


// Calls the "checkFlights" method



let{taskId}=awaitthis.schedule(600,"checkFlights",{ flight:"DL264", date:"2025-02-23"});




returnResponse.json({taskId});



}



asynccheckFlights(data){



// Invoked when our scheduled task runs


// We can also call this.schedule here to schedule another task


}


}

```

Tasks that set a callback for a method that does not exist will throw an exception: ensure that the method named in the `callback` argument of `this.schedule` exists on your `Agent` class.
You can schedule tasks in multiple ways:
 * 
 * 

JavaScript```

// schedule a task to run in 10 seconds



lettask=awaitthis.schedule(10,"someTask",{ message:"hello"});



// schedule a task to run at a specific date



lettask=awaitthis.schedule(newDate("2025-01-01"),"someTask",{});



// schedule a task to run every 10 minutes



let{id}=awaitthis.schedule("*/10 * * * *","someTask",{




message:"hello",




});



// schedule a task to run every 10 minutes, but only on Mondays



lettask=awaitthis.schedule("*/10 * * * 1","someTask",{




message:"hello",




});



// cancel a scheduled task



this.cancelSchedule(task.id);


```

TypeScript```

// schedule a task to run in 10 seconds



lettask=awaitthis.schedule(10,"someTask",{ message:"hello"});



// schedule a task to run at a specific date



lettask=awaitthis.schedule(newDate("2025-01-01"),"someTask",{});



// schedule a task to run every 10 minutes



let{id}=awaitthis.schedule("*/10 * * * *","someTask",{ message:"hello"});



// schedule a task to run every 10 minutes, but only on Mondays



lettask=awaitthis.schedule("*/10 * * * 1","someTask",{ message:"hello"});



// cancel a scheduled task



this.cancelSchedule(task.id);


```

Calling `await this.schedule` returns a `Schedule`, which includes the task's randomly generated `id`. You can use this `id` to retrieve or cancel the task in the future. It also provides a `type` property that indicates the type of schedule, for example, one of `"scheduled" | "delayed" | "cron"`.
Each task is mapped to a row in the Agent's underlying SQLite database, which means that each task can be up to 2 MB in size. The maximum number of tasks must be `(task_size * tasks) + all_other_state < maximum_database_size` (currently 1GB per Agent).
### Managing scheduled tasks
[](https://developers.cloudflare.com/agents/api-reference/schedule-tasks/#managing-scheduled-tasks)
You can get, cancel and filter across scheduled tasks within an Agent using the scheduling API:
 * 
 * 

JavaScript```

// Get a specific schedule by ID


// Returns undefined if the task does not exist



lettask=awaitthis.getSchedule(task.id);



// Get all scheduled tasks


// Returns an array of Schedule objects



lettasks=this.getSchedules();



// Cancel a task by its ID


// Returns true if the task was cancelled, false if it did not exist



awaitthis.cancelSchedule(task.id);



// Filter for specific tasks


// e.g. all tasks starting in the next hour



lettasks=this.getSchedules({




timeRange:{




start:newDate(Date.now()),




end:newDate(Date.now() +60*60*1000),



},



});


```

TypeScript```

// Get a specific schedule by ID


// Returns undefined if the task does not exist



lettask=awaitthis.getSchedule(task.id)



// Get all scheduled tasks


// Returns an array of Schedule objects



lettasks=this.getSchedules();



// Cancel a task by its ID


// Returns true if the task was cancelled, false if it did not exist



awaitthis.cancelSchedule(task.id);



// Filter for specific tasks


// e.g. all tasks starting in the next hour



lettasks=this.getSchedules({




timeRange:{




start:newDate(Date.now()),




end:newDate(Date.now() +60*60*1000),



}



});


```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/schedule-tasks.mdx)
Last updated: Sep 24, 2025
 Previous 
Using AI Models Next 
Run Workflows 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Human in the Loop · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/concepts/human-in-the-loop

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839555

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * What is Human-in-the-Loop? 
 * Best practices for Human-in-the-Loop workflows 

## On this page
 * Overview 
 * What is Human-in-the-Loop? 
 * Best practices for Human-in-the-Loop workflows 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Concepts 
 5. Human in the Loop 

Copy page
# Human in the Loop
### What is Human-in-the-Loop?
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#what-is-human-in-the-loop)
Human-in-the-Loop (HITL) workflows integrate human judgment and oversight into automated processes. These workflows pause at critical points for human review, validation, or decision-making before proceeding. This approach combines the efficiency of automation with human expertise and oversight where it matters most.
!A human-in-the-loop diagram
#### Understanding Human-in-the-Loop workflows
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#understanding-human-in-the-loop-workflows)
In a Human-in-the-Loop workflow, processes are not fully automated. Instead, they include designated checkpoints where human intervention is required. For example, in a travel booking system, a human may want to confirm the travel before an agent follows through with a transaction. The workflow manages this interaction, ensuring that:
 1. The process pauses at appropriate review points
 2. Human reviewers receive necessary context
 3. The system maintains state during the review period
 4. Review decisions are properly incorporated
 5. The process continues once approval is received

### Best practices for Human-in-the-Loop workflows
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#best-practices-for-human-in-the-loop-workflows)
#### Long-Term State Persistence
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#long-term-state-persistence)
Human review processes do not operate on predictable timelines. A reviewer might need days or weeks to make a decision, especially for complex cases requiring additional investigation or multiple approvals. Your system needs to maintain perfect state consistency throughout this period, including:
 * The original request and context
 * All intermediate decisions and actions
 * Any partial progress or temporary states
 * Review history and feedback

Durable Objects provide an ideal solution for managing state in Human-in-the-Loop workflows, offering persistent compute instances that maintain state for hours, weeks, or months.
#### Continuous Improvement Through Evals
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#continuous-improvement-through-evals)
Human reviewers play a crucial role in evaluating and improving LLM performance. Implement a systematic evaluation process where human feedback is collected not just on the final output, but on the LLM's decision-making process. This can include:
 * Decision Quality Assessment: Have reviewers evaluate the LLM's reasoning process and decision points, not just the final output.
 * Edge Case Identification: Use human expertise to identify scenarios where the LLM's performance could be improved.
 * Feedback Collection: Gather structured feedback that can be used to fine-tune the LLM or adjust the workflow. AI Gateway can be a useful tool for setting up an LLM feedback loop.

#### Error handling and recovery
[](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/#error-handling-and-recovery)
Robust error handling is essential for maintaining workflow integrity. Your system should gracefully handle various failure scenarios, including reviewer unavailability, system outages, or conflicting reviews. Implement clear escalation paths for handling exceptional cases that fall outside normal parameters.
The system should maintain stability during paused states, ensuring that no work is lost even during extended review periods. Consider implementing automatic checkpointing that allows workflows to be resumed from the last stable state after any interruption.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/concepts/human-in-the-loop.mdx)
Last updated: Apr 30, 2025
 Previous 
Tools Next 
Calling LLMs 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Agents · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839734

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Ship your first Agent 
 * Why build agents on Cloudflare? 
 * Build on the Cloudflare Platform 

## On this page
 * Overview 
 * Ship your first Agent 
 * Why build agents on Cloudflare? 
 * Build on the Cloudflare Platform 

## Tags
 AI 

## Was this helpful?

 1. Directory 
 2. Agents 

Copy page
# Build Agents on Cloudflare
The Agents SDK enables you to build and deploy AI-powered agents that can autonomously perform tasks, communicate with clients in real time, call AI models, persist state, schedule tasks, run asynchronous workflows, browse the web, query data from your database, support human-in-the-loop interactions, and a lot more.
### Ship your first Agent
[](https://developers.cloudflare.com/agents/#ship-your-first-agent)
To use the Agent starter template and create your first Agent with the Agents SDK:
Terminal window```

# install it



npmcreatecloudflare@latestagents-starter----template=cloudflare/agents-starter



# and deploy it



npxwrangler@latestdeploy


```

Head to the guide on building a chat agent to learn how the starter project is built and how to use it as a foundation for your own agents.
If you're already building on Workers, you can install the `agents` package directly into an existing project:
Terminal window```


npmiagents


```

And then define your first Agent by creating a class that extends the `Agent` class:
 * 
 * 

JavaScript```


import {Agent,AgentNamespace} from "agents";




exportclassMyAgentextendsAgent{



// Define methods on the Agent:


// https://developers.cloudflare.com/agents/api-reference/agents-api/


//


// Every Agent has built in state via this.setState and this.sql


// Built-in scheduling via this.schedule


// Agents support WebSockets, HTTP requests, state synchronization and


// can run for seconds, minutes or hours: as long as the tasks need.


}

```

TypeScript```


import {Agent,AgentNamespace} from "agents";




exportclassMyAgentextendsAgent{



// Define methods on the Agent:


// https://developers.cloudflare.com/agents/api-reference/agents-api/


//


// Every Agent has built in state via this.setState and this.sql


// Built-in scheduling via this.schedule


// Agents support WebSockets, HTTP requests, state synchronization and


// can run for seconds, minutes or hours: as long as the tasks need.


}

```

Lastly, add the Durable Objects binding to your wrangler file:
 * 
 * 

```

{



"durable_objects":{




"bindings":[



{



"name":"MyAgent",




"class_name":"MyAgent"



}


]


},



"migrations":[



{



"tag":"v1",




"new_sqlite_classes":[



"MyAgent"


]


}


]


}

```

```


[[durable_objects.bindings]]




name="MyAgent"




class_name="MyAgent"




[[migrations]]




tag="v1"




new_sqlite_classes=["MyAgent"]


```

Dive into the Agent SDK reference to learn more about how to use the Agents SDK package and defining an `Agent`.
### Why build agents on Cloudflare?
[](https://developers.cloudflare.com/agents/#why-build-agents-on-cloudflare)
We built the Agents SDK with a few things in mind:
 * **Batteries (state) included** : Agents come with built-in state management, with the ability to automatically sync state between an Agent and clients, trigger events on state changes, and read+write to each Agent's SQL database.
 * **Communicative** : You can connect to an Agent via WebSockets and stream updates back to client in real-time. Handle a long-running response from a reasoning model, the results of an asynchronous workflow, or build a chat app that builds on the `useAgent` hook included in the Agents SDK.
 * **Extensible** : Agents are code. Use the AI models you want, bring-your-own headless browser service, pull data from your database hosted in another cloud, add your own methods to your Agent and call them.

Agents built with Agents SDK can be deployed directly to Cloudflare and run on top of Durable Objects — which you can think of as stateful micro-servers that can scale to tens of millions — and are able to run wherever they need to. Run your Agents close to a user for low-latency interactivity, close to your data for throughput, and/or anywhere in between.
* * *
### Build on the Cloudflare Platform
[](https://developers.cloudflare.com/agents/#build-on-the-cloudflare-platform)
**Workers **
Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.
**AI Gateway **
Observe and control your AI applications with caching, rate limiting, request retries, model fallback, and more.
**Vectorize **
Build full-stack AI applications with Vectorize, Cloudflare’s vector database. Adding Vectorize enables you to perform tasks such as semantic search, recommendations, anomaly detection or can be used to provide context and memory to an LLM.
**Workers AI **
Run machine learning models, powered by serverless GPUs, on Cloudflare's global network.
**Workflows **
Build stateful agents that guarantee executions, including automatic retries, persistent state that runs for minutes, hours, days, or weeks.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/index.mdx)
Last updated: Aug 19, 2025
 Next 
Build a Chat Agent ↗ 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Configuration · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/configuration

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.839878

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Project structure 
 * Example configuration 

## On this page
 * Overview 
 * Project structure 
 * Example configuration 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Configuration 

Copy page
# Configuration
An Agent is configured like any other Cloudflare Workers project, and uses a wrangler configuration file to define where your code is and what services (bindings) it will use.
### Project structure
[](https://developers.cloudflare.com/agents/api-reference/configuration/#project-structure)
The typical file structure for an Agent project created from `npm create cloudflare@latest agents-starter -- --template cloudflare/agents-starter` follows:
Terminal window```

.



|--package-lock.json




|--package.json




|--public




|`-- index.html




|-- src




|`--index.ts//yourAgentdefinition




|--test




||--index.spec.ts//yourtests




|`-- tsconfig.json




|-- tsconfig.json




|-- vitest.config.mts




|-- worker-configuration.d.ts




`--wrangler.jsonc//yourWorkers&Agentconfiguration


```

### Example configuration
[](https://developers.cloudflare.com/agents/api-reference/configuration/#example-configuration)
Below is a minimal `wrangler.jsonc` file that defines the configuration for an Agent, including the entry point, `durable_object` namespace, and code `migrations`:
 * 
 * 

```

{



"$schema":"node_modules/wrangler/config-schema.json",




"name":"agents-example",




"main":"src/index.ts",




"compatibility_date":"2025-02-23",




"compatibility_flags":["nodejs_compat"],




"durable_objects":{




"bindings":[



{


// Required:



"name":"MyAgent",// How your Agent is called from your Worker




"class_name":"MyAgent",// Must match the class name of the Agent in your code



// Optional: set this if the Agent is defined in another Worker script



"script_name":"the-other-worker"



},


],


},



"migrations":[



{



"tag":"v1",



// Mandatory for the Agent to store state



"new_sqlite_classes":["MyAgent"],



},


],



"observability":{




"enabled":true,



},


}

```

```


"$schema"="node_modules/wrangler/config-schema.json"




name="agents-example"




main="src/index.ts"




compatibility_date="2025-02-23"




compatibility_flags=["nodejs_compat"]




[[durable_objects.bindings]]




name="MyAgent"




class_name="MyAgent"




script_name="the-other-worker"




[[migrations]]




tag="v1"




new_sqlite_classes=["MyAgent"]




[observability]




enabled=true


```

The configuration includes:
 * A `main` field that points to the entry point of your Agent, which is typically a TypeScript (or JavaScript) file.
 * A `durable_objects` field that defines the Durable Object namespace that your Agents will run within.
 * A `migrations` field that defines the code migrations that your Agent will use. This field is mandatory and must contain at least one migration. The `new_sqlite_classes` field is mandatory for the Agent to store state.

Agents must define these fields in their `wrangler.jsonc` (or `wrangler.toml`) config file.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/configuration.mdx)
Last updated: Mar 18, 2025
 Previous 
Using WebSockets Next 
Patterns 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Browse the web · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/browse-the-web

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.840081

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Browser Rendering API 
 * Browserbase 

## On this page
 * Overview 
 * Browser Rendering API 
 * Browserbase 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Browse the web 

Copy page
# Browse the web
Agents can browse the web using the Browser Rendering API or your preferred headless browser service.
### Browser Rendering API
[](https://developers.cloudflare.com/agents/api-reference/browse-the-web/#browser-rendering-api)
The Browser Rendering allows you to spin up headless browser instances, render web pages, and interact with websites through your Agent.
You can define a method that uses Puppeteer to pull the content of a web page, parse the DOM, and extract relevant information by calling the OpenAI model:
 * 
 * 

JavaScript```


exportclassMyAgentextendsAgent{




asyncbrowse(browserInstance,urls){




letresponses= [];




for (consturlofurls) {




constbrowser=awaitpuppeteer.launch(browserInstance);




constpage=awaitbrowser.newPage();




awaitpage.goto(url);




awaitpage.waitForSelector("body");




constbodyContent=awaitpage.$eval(




"body",




(element)=>element.innerHTML,




);




constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




letresp=awaitclient.chat.completions.create({




model:this.env.MODEL,




messages: [



{



role:"user",




content:`Return a JSON object with the product names, prices and URLs with the following format: { "name": "Product Name", "price": "Price", "url": "URL" } from the website content below. <content>${bodyContent}</content>`,



},



],




response_format:{




type:"json_object",



},



});




responses.push(resp);




awaitbrowser.close();



}



returnresponses;



}


}

```

TypeScript```


interfaceEnv{




BROWSER:Fetcher;



}



exportclassMyAgentextendsAgent<Env>{




asyncbrowse(browserInstance:Fetcher,urls:string[]){




letresponses= [];




for (consturlofurls) {




constbrowser=awaitpuppeteer.launch(browserInstance);




constpage=awaitbrowser.newPage();




awaitpage.goto(url);




awaitpage.waitForSelector("body");




constbodyContent=awaitpage.$eval(




"body",




(element)=>element.innerHTML,




);




constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




letresp=awaitclient.chat.completions.create({




model:this.env.MODEL,




messages: [



{



role:"user",




content:`Return a JSON object with the product names, prices and URLs with the following format: { "name": "Product Name", "price": "Price", "url": "URL" } from the website content below. <content>${bodyContent}</content>`,



},



],




response_format:{




type:"json_object",



},



});




responses.push(resp);




awaitbrowser.close();



}



returnresponses;



}


}

```

You'll also need to add install the `@cloudflare/puppeteer` package and add the following to the wrangler configuration of your Agent:
 * 
 * 
 * 

Terminal window```


npmi-D@cloudflare/puppeteer


```

Terminal window```


yarnadd-D@cloudflare/puppeteer


```

Terminal window```


pnpmadd-D@cloudflare/puppeteer


```

 * 
 * 

```

{


// ...



"browser":{




"binding":"MYBROWSER",



},


// ...


}

```

```


[browser]




binding="MYBROWSER"


```

### Browserbase
[](https://developers.cloudflare.com/agents/api-reference/browse-the-web/#browserbase)
You can also use Browserbase ↗ by using the Browserbase API directly from within your Agent.
Once you have your Browserbase API key ↗, you can add it to your Agent by creating a secret:
Terminal window```


cdyour-agent-project-folder




npxwrangler@latestsecretputBROWSERBASE_API_KEY


```

```


Enterasecretvalue:******




CreatingthesecretfortheWorker"agents-example"




Success!UploadedsecretBROWSERBASE_API_KEY


```

Install the `@cloudflare/puppeteer` package and use it from within your Agent to call the Browserbase API:
 * 
 * 
 * 

Terminal window```


npmi@cloudflare/puppeteer


```

Terminal window```


yarnadd@cloudflare/puppeteer


```

Terminal window```


pnpmadd@cloudflare/puppeteer


```

 * 
 * 

JavaScript```


exportclassMyAgentextendsAgent{




constructor(env){




super(env);



}


}

```

TypeScript```


interfaceEnv{




BROWSERBASE_API_KEY:string;



}



exportclassMyAgentextendsAgent<Env>{




constructor(env:Env){




super(env);



}


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/browse-the-web.mdx)
Last updated: May 16, 2025
 Previous 
Store and sync state Next 
HTTP and Server-Sent Events 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Calling LLMs · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/concepts/calling-llms

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.840203

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Understanding LLM providers and model types 

## On this page
 * Overview 
 * Understanding LLM providers and model types 

## Tags
 LLM 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Concepts 
 5. Calling LLMs 

Copy page
# Calling LLMs
### Understanding LLM providers and model types
[](https://developers.cloudflare.com/agents/concepts/calling-llms/#understanding-llm-providers-and-model-types)
Different LLM providers offer models optimized for specific types of tasks. When building AI systems, choosing the right model is crucial for both performance and cost efficiency.
#### Reasoning Models
[](https://developers.cloudflare.com/agents/concepts/calling-llms/#reasoning-models)
Models like OpenAI's o1, Anthropic's Claude, and DeepSeek's R1 are particularly well-suited for complex reasoning tasks. These models excel at:
 * Breaking down problems into steps
 * Following complex instructions
 * Maintaining context across long conversations
 * Generating code and technical content

For example, when implementing a travel booking system, you might use a reasoning model to analyze travel requirements and generate appropriate booking strategies.
#### Instruction Models
[](https://developers.cloudflare.com/agents/concepts/calling-llms/#instruction-models)
Models like GPT-4 and Claude Instant are optimized for following straightforward instructions efficiently. They work well for:
 * Content generation
 * Simple classification tasks
 * Basic question answering
 * Text transformation

These models are often more cost-effective for straightforward tasks that do not require complex reasoning.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/concepts/calling-llms.mdx)
Last updated: Aug 15, 2025
 Previous 
Human in the Loop Next 
API Reference 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Calling Agents · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/calling-agents

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.840589

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Calling your Agent 
 * Calling methods on Agents 
 * Naming your Agents 
 * Authenticating Agents 
 * Next steps 

## On this page
 * Overview 
 * Calling your Agent 
 * Calling methods on Agents 
 * Naming your Agents 
 * Authenticating Agents 
 * Next steps 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Calling Agents 

Copy page
# Calling Agents
Learn how to call your Agents from Workers, including how to create Agents on-the-fly, address them, and route requests to specific instances of an Agent.
### Calling your Agent
[](https://developers.cloudflare.com/agents/api-reference/calling-agents/#calling-your-agent)
Agents are created on-the-fly and can serve multiple requests concurrently. Each Agent instance is isolated from other instances, can maintain its own state, and has a unique address.
An instance of an Agent is globally unique: given the same name (or ID), you will always get the same instance of an agent.
This allows you to avoid synchronizing state across requests: if an Agent instance represents a specific user, team, channel or other entity, you can use the Agent instance to store state for that entity. No need to set up a centralized session store.
If the client disconnects, you can always route the client back to the exact same Agent and pick up where they left off.
You can create and run an instance of an Agent directly from a Worker using either:
 * The `routeAgentRequest` helper: this will automatically map requests to an individual Agent based on the `/agents/:agent/:name` URL pattern. The value of `:agent` will be the name of your Agent class converted to `kebab-case`, and the value of `:name` will be the name of the Agent instance you want to create or retrieve.
 * `getAgentByName`, which will create a new Agent instance if none exists by that name, or retrieve a handle to an existing instance.

See the usage patterns in the following example:
 * 
 * 

JavaScript```


import {




Agent,




AgentNamespace,




getAgentByName,




routeAgentRequest,




} from "agents";




exportdefault{




asyncfetch(request,env,ctx){



// Routed addressing


// Automatically routes HTTP requests and/or WebSocket connections to /agents/:agent/:name


// Best for: connecting React apps directly to Agents using useAgent from agents/react



return (




(awaitrouteAgentRequest(request,env)) ||




Response.json({ msg:"no agent here"},{ status:404})




);



// Named addressing


// Best for: convenience method for creating or retrieving an agent by name/ID.


// Bringing your own routing, middleware and/or plugging into an existing


// application or framework.



letnamedAgent=getAgentByName(env.MyAgent,"my-unique-agent-id");



// Pass the incoming request straight to your Agent



letnamedResp= (awaitnamedAgent).fetch(request);




returnnamedResp;



},


};



exportclassMyAgentextendsAgent{



// Your Agent implementation goes here


}

```

TypeScript```


import {Agent,AgentNamespace,getAgentByName,routeAgentRequest} from 'agents';




interfaceEnv{



// Define your Agent on the environment here


// Passing your Agent class as a TypeScript type parameter allows you to call


// methods defined on your Agent.



MyAgent:AgentNamespace<MyAgent>;



}



exportdefault{




asyncfetch(request,env,ctx):Promise<Response>{



// Routed addressing


// Automatically routes HTTP requests and/or WebSocket connections to /agents/:agent/:name


// Best for: connecting React apps directly to Agents using useAgent from agents/react



return (awaitrouteAgentRequest(request,env)) ||Response.json({ msg:'no agent here'},{ status:404});



// Named addressing


// Best for: convenience method for creating or retrieving an agent by name/ID.


// Bringing your own routing, middleware and/or plugging into an existing


// application or framework.



letnamedAgent=getAgentByName<Env,MyAgent>(env.MyAgent,'my-unique-agent-id');



// Pass the incoming request straight to your Agent



letnamedResp= (awaitnamedAgent).fetch(request);




returnnamedResp



},



}satisfiesExportedHandler<Env>;




exportclassMyAgentextendsAgent<Env>{



// Your Agent implementation goes here


}

```

You can also call other Agents from within an Agent and build multi-Agent systems.
Calling other Agents uses the same APIs as calling into an Agent directly.
### Calling methods on Agents
[](https://developers.cloudflare.com/agents/api-reference/calling-agents/#calling-methods-on-agents)
When using `getAgentByName`, you can pass both requests (including WebSocket) connections and call methods defined directly on the Agent itself using the native JavaScript RPC (JSRPC) API.
For example, once you have a handle (or "stub") to an unique instance of your Agent, you can call methods on it:
 * 
 * 

JavaScript```


import {Agent,AgentNamespace,getAgentByName} from "agents";




exportdefault{




asyncfetch(request,env,ctx){




letnamedAgent=getAgentByName(env.MyAgent,"my-unique-agent-id");



// Call methods directly on the Agent, and pass native JavaScript objects



letchatResponse=namedAgent.chat("Hello!");



// No need to serialize/deserialize it from a HTTP request or WebSocket


// message and back again



letagentState=namedAgent.getState();// agentState is of type UserHistory




returnnamedResp;



},


};



exportclassMyAgentextendsAgent{



// Your Agent implementation goes here



asyncchat(prompt){



// call your favorite LLM



return"result";



}



asyncgetState(){



// Return the Agent's state directly



returnthis.state;



}


// Other methods as you see fit!


}

```

TypeScript```


import {Agent,AgentNamespace,getAgentByName} from 'agents';




interfaceEnv{



// Define your Agent on the environment here


// Passing your Agent class as a TypeScript type parameter allows you to call


// methods defined on your Agent.



MyAgent:AgentNamespace<MyAgent>;



}



interfaceUserHistory{




history:string[];




lastUpdated:Date;



}



exportdefault{




asyncfetch(request,env,ctx):Promise<Response>{




letnamedAgent=getAgentByName<Env,MyAgent>(env.MyAgent,'my-unique-agent-id');



// Call methods directly on the Agent, and pass native JavaScript objects



letchatResponse=namedAgent.chat('Hello!');



// No need to serialize/deserialize it from a HTTP request or WebSocket


// message and back again



letagentState=namedAgent.getState() // agentState is of type UserHistory




returnnamedResp



},



}satisfiesExportedHandler<Env>;




exportclassMyAgentextendsAgent<Env,UserHistory>{



// Your Agent implementation goes here



asyncchat(prompt:string){



// call your favorite LLM



return"result"



}



asyncgetState(){



// Return the Agent's state directly



returnthis.state;



}


// Other methods as you see fit!


}

```

When using TypeScript, ensure you pass your Agent class as a TypeScript type parameter to the AgentNamespace type so that types are correctly inferred:
TypeScript```


interfaceEnv{



// Passing your Agent class as a TypeScript type parameter allows you to call


// methods defined on your Agent.



MyAgent:AgentNamespace<CodeReviewAgent>;



}



exportclassCodeReviewAgentextendsAgent<Env,AgentState>{



// Agent methods here


}

```

### Naming your Agents
[](https://developers.cloudflare.com/agents/api-reference/calling-agents/#naming-your-agents)
When creating names for your Agents, think about what the Agent represents. A unique user? A team or company? A room or channel for collaboration?
A consistent approach to naming allows you to:
 * direct incoming requests directly to the right Agent
 * deterministically route new requests back to that Agent, no matter where the client is in the world.
 * avoid having to rely on centralized session storage or external services for state management, since each Agent instance can maintain its own state.

For a given Agent definition (or 'namespace' in the code below), there can be millions (or tens of millions) of instances of that Agent, each handling their own requests, making calls to LLMs, and maintaining their own state.
For example, you might have an Agent for every user using your new AI-based code editor. In that case, you'd want to create Agents based on the user ID from your system, which would then allow that Agent to handle all requests for that user.
It also ensures that state within the Agent, including chat history, language preferences, model configuration and other context can associated specifically with that user, making it easier to manage state.
The example below shows how to create a unique agent Agent for each `userId` in a request:
 * 
 * 

JavaScript```


import {




Agent,




AgentNamespace,




getAgentByName,




routeAgentRequest,




} from "agents";




exportdefault{




asyncfetch(request,env,ctx){




letuserId=newURL(request.url).searchParams.get("userId") ||"anonymous";



// Use an identifier that allows you to route to requests, WebSockets or call methods on the Agent


// You can also put authentication logic here - e.g. to only create or retrieve Agents for known users.



letnamedAgent=getAgentByName(env.MyAgent,"my-unique-agent-id");




return (awaitnamedAgent).fetch(request);



},


};



exportclassMyAgentextendsAgent{



// You can access the name of the agent via this.name in any method within


// the Agent



asynconStartup(){




console.log(`agent ${this.name} ready!`);



}


}

```

TypeScript```


import {Agent,AgentNamespace,getAgentByName,routeAgentRequest} from 'agents';




interfaceEnv{




MyAgent:AgentNamespace<MyAgent>;



}



exportdefault{




asyncfetch(request,env,ctx):Promise<Response>{




letuserId=newURL(request.url).searchParams.get('userId') ||'anonymous';



// Use an identifier that allows you to route to requests, WebSockets or call methods on the Agent


// You can also put authentication logic here - e.g. to only create or retrieve Agents for known users.



letnamedAgent=getAgentByName<Env,MyAgent>(env.MyAgent,'my-unique-agent-id');




return (awaitnamedAgent).fetch(request);



},



}satisfiesExportedHandler<Env>;




exportclassMyAgentextendsAgent<Env>{



// You can access the name of the agent via this.name in any method within


// the Agent



asynconStartup(){console.log(`agent ${this.name} ready!`)}



}

```

Replace `userId` with `teamName`, `channel`, `companyName` as fits your Agents goals - and/or configure authentication to ensure Agents are only created for known, authenticated users.
### Authenticating Agents
[](https://developers.cloudflare.com/agents/api-reference/calling-agents/#authenticating-agents)
When building and deploying Agents using the Agents SDK, you will often want to authenticate clients before passing requests to an Agent in order to restrict who the Agent will call, authorize specific users for specific Agents, and/or to limit who can access administrative or debug APIs exposed by an Agent.
As best practices:
 * Handle authentication in your Workers code, before you invoke your Agent.
 * Use the built-in hooks when using the `routeAgentRequest` helper - `onBeforeConnect` and `onBeforeRequest`
 * Use your preferred router (such as Hono) and authentication middleware or provider to apply custom authentication schemes before calling an Agent using other methods.

The `routeAgentRequest` helper documented earlier in this guide exposes two useful hooks (`onBeforeConnect`, `onBeforeRequest`) that allow you to apply custom logic before creating or retrieving an Agent:
 * 
 * 

JavaScript```


import {Agent,AgentNamespace,routeAgentRequest} from "agents";




exportdefault{




asyncfetch(request,env,ctx){



// Use the onBeforeConnect and onBeforeRequest hooks to authenticate clients


// or run logic before handling a HTTP request or WebSocket.



return (




(awaitrouteAgentRequest(request,env,{



// Run logic before a WebSocket client connects



onBeforeConnect:(request)=>{



// Your code/auth code here


// You can return a Response here - e.g. a HTTP 403 Not Authorized -


// which will stop further request processing and will NOT invoke the


// Agent.


// return Response.json({"error": "not authorized"}, { status: 403 })


},


// Run logic before a HTTP client clients



onBeforeRequest:(request)=>{



// Your code/auth code here


// Returning nothing will result in the call to the Agent continuing


},


// Prepend a prefix for how your Agents are named here



prefix:"name-prefix-here",




})) ||Response.json({ msg:"no agent here"},{ status:404})




);



},


};

```

TypeScript```


import {Agent,AgentNamespace,routeAgentRequest} from 'agents';




interfaceEnv{




MyAgent:AgentNamespace<MyAgent>;



}



exportdefault{




asyncfetch(request,env,ctx):Promise<Response>{



// Use the onBeforeConnect and onBeforeRequest hooks to authenticate clients


// or run logic before handling a HTTP request or WebSocket.



return (




(awaitrouteAgentRequest(request,env,{



// Run logic before a WebSocket client connects



onBeforeConnect:(request)=>{



// Your code/auth code here


// You can return a Response here - e.g. a HTTP 403 Not Authorized -


// which will stop further request processing and will NOT invoke the


// Agent.


// return Response.json({"error": "not authorized"}, { status: 403 })


},


// Run logic before a HTTP client clients



onBeforeRequest:(request)=>{



// Your code/auth code here


// Returning nothing will result in the call to the Agent continuing


},


// Prepend a prefix for how your Agents are named here



prefix:'name-prefix-here',




})) ||Response.json({ msg:'no agent here'},{ status:404})




);



},



}satisfiesExportedHandler<Env>;


```

If you are using `getAgentByName` or the underlying Durable Objects routing API, you should authenticate incoming requests or WebSocket connections before calling `getAgentByName`.
For example, if you are using Hono ↗, you can authenticate in the middleware before calling an Agent and passing a request (or a WebSocket connection) to it:
 * 
 * 

JavaScript```


import {Agent,AgentNamespace,getAgentByName} from "agents";




import {Hono} from "hono";




constapp=newHono();




app.use("/code-review/*",async(c,next)=>{



// Perform auth here


// e.g. validate a Bearer token, a JWT, use your preferred auth library


// return Response.json({ msg: 'unauthorized' }, { status: 401 });



awaitnext();// continue on if valid




});




app.get("/code-review/:id",async(c)=>{




constid=c.req.param("teamId");




if (!id) returnResponse.json({ msg:"missing id"},{ status:400});



// Call the Agent, creating it with the name/identifier from the ":id" segment


// of our URL



constagent=awaitgetAgentByName(c.env.MyAgent,id);



// Pass the request to our Agent instance



returnawaitagent.fetch(c.req.raw);




});


```

TypeScript```


import {Agent,AgentNamespace,getAgentByName} from 'agents';




import {Hono} from 'hono';




constapp=newHono<{Bindings:Env}>();




app.use('/code-review/*',async(c,next)=>{



// Perform auth here


// e.g. validate a Bearer token, a JWT, use your preferred auth library


// return Response.json({ msg: 'unauthorized' }, { status: 401 });



awaitnext();// continue on if valid




});




app.get('/code-review/:id',async(c)=>{




constid=c.req.param('teamId');




if (!id) returnResponse.json({ msg:'missing id'},{ status:400});



// Call the Agent, creating it with the name/identifier from the ":id" segment


// of our URL



constagent=awaitgetAgentByName<Env,MyAgent>(c.env.MyAgent,id);



// Pass the request to our Agent instance



returnawaitagent.fetch(c.req.raw);




});


```

This ensures we only create Agents for authenticated users, and allows you to validate whether Agent names conform to your preferred naming scheme before instances are created.
### Next steps
[](https://developers.cloudflare.com/agents/api-reference/calling-agents/#next-steps)
 * Review the API documentation for the Agents class to learn how to define
 * Build a chat Agent using the Agents SDK and deploy it to Workers.
 * Learn more using WebSockets to build interactive Agents and stream data back from your Agent.
 * Orchestrate asynchronous workflows from your Agent by combining the Agents SDK and Workflows.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/calling-agents.mdx)
Last updated: Aug 27, 2025
 Previous 
Agents API Next 
Using AI Models 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Using AI Models · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/using-ai-models

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.840984

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Calling AI Models 
 * Long-running model requests 
 * Workers AI 
 * Hosted models 
 * Model routing 
 * AI SDK 
 * OpenAI compatible endpoints 

## On this page
 * Overview 
 * Calling AI Models 
 * Long-running model requests 
 * Workers AI 
 * Hosted models 
 * Model routing 
 * AI SDK 
 * OpenAI compatible endpoints 

## Tags
 AI 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Using AI Models 

Copy page
# Using AI Models
Agents can communicate with AI models hosted on any provider, including:
 * Workers AI
 * The AI SDK ↗
 * OpenAI ↗
 * Anthropic ↗
 * Google's Gemini ↗

You can also use the model routing features in AI Gateway to route across providers, eval responses, and manage AI provider rate limits.
Because Agents are built on top of Durable Objects, each Agent or chat session is associated with a stateful compute instance. Traditional serverless architectures often present challenges for persistent connections needed in real-time applications like chat.
A user can disconnect during a long-running response from a modern reasoning model (such as `o3-mini` or DeepSeek R1), or lose conversational context when refreshing the browser. Instead of relying on request-response patterns and managing an external database to track & store conversation state, state can be stored directly within the Agent. If a client disconnects, the Agent can write to its own distributed storage, and catch the client up as soon as it reconnects: even if it's hours or days later.
## Calling AI Models
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#calling-ai-models)
You can call models from any method within an Agent, including from HTTP requests using the `onRequest` handler, when a scheduled task runs, when handling a WebSocket message in the `onMessage` handler, or from any of your own methods.
Importantly, Agents can call AI models on their own — autonomously — and can handle long-running responses that can take minutes (or longer) to respond in full.
### Long-running model requests
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#long-running-model-requests)
Modern reasoning models ↗ or "thinking" model can take some time to both generate a response _and_ stream the response back to the client.
Instead of buffering the entire response, or risking the client disconnecting, you can stream the response back to the client by using the WebSocket API.
 * 
 * 

src/index.js```


import {Agent} from "agents";




import {OpenAI} from "openai";




exportclassMyAgentextendsAgent{




asynconConnect(connection,ctx){



//


}



asynconMessage(connection,message){




letmsg=JSON.parse(message);



// This can run as long as it needs to, and return as many messages as it needs to!



awaitqueryReasoningModel(connection,msg.prompt);



}



asyncqueryReasoningModel(connection,userPrompt){




constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




try{




conststream=awaitclient.chat.completions.create({




model:this.env.MODEL||"o3-mini",




messages: [{ role:"user", content:userPrompt}],




stream: true,




});



// Stream responses back as WebSocket messages



forawait (constchunkofstream) {




constcontent=chunk.choices[0]?.delta?.content||"";




if (content) {




connection.send(JSON.stringify({ type:"chunk",content}));



}


}


// Send completion message



connection.send(JSON.stringify({ type:"done"}));




}catch (error) {




connection.send(JSON.stringify({ type:"error", error:error}));



}


}


}

```

src/index.ts```


import {Agent} from "agents";




import {OpenAI} from "openai";




exportclassMyAgentextendsAgent<Env>{




asynconConnect(connection:Connection,ctx:ConnectionContext){



//


}



asynconMessage(connection:Connection,message:WSMessage){




letmsg=JSON.parse(message);



// This can run as long as it needs to, and return as many messages as it needs to!



awaitqueryReasoningModel(connection,msg.prompt);



}



asyncqueryReasoningModel(connection:Connection,userPrompt:string){




constclient=newOpenAI({




apiKey:this.env.OPENAI_API_KEY,




});




try{




conststream=awaitclient.chat.completions.create({




model:this.env.MODEL||"o3-mini",




messages: [{ role:"user", content:userPrompt}],




stream: true,




});



// Stream responses back as WebSocket messages



forawait (constchunkofstream) {




constcontent=chunk.choices[0]?.delta?.content||"";




if (content) {




connection.send(JSON.stringify({ type:"chunk",content}));



}


}


// Send completion message



connection.send(JSON.stringify({ type:"done"}));




}catch (error) {




connection.send(JSON.stringify({ type:"error", error:error}));



}


}


}

```

You can also persist AI model responses back to Agent's internal state by using the `this.setState` method. For example, if you run a scheduled task, you can store the output of the task and read it later. Or, if a user disconnects, read the message history back and send it to the user when they reconnect.
### Workers AI
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#workers-ai)
### Hosted models
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#hosted-models)
You can use any of the models available in Workers AI within your Agent by configuring a binding.
Workers AI supports streaming responses out-of-the-box by setting `stream: true`, and we strongly recommend using them to avoid buffering and delaying responses, especially for larger models or reasoning models that require more time to generate a response.
 * 
 * 

src/index.js```


import {Agent} from "agents";




exportclassMyAgentextendsAgent{




asynconRequest(request){




constresponse=awaitenv.AI.run(




"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",



{



prompt:"Build me a Cloudflare Worker that returns JSON.",




stream: true,// Stream a response and don't block the client!



},



);



// Return the stream



returnnewResponse(answer,{




headers:{"content-type":"text/event-stream"},




});



}


}

```

src/index.ts```


import {Agent} from "agents";




interfaceEnv{




AI:Ai;



}



exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){




constresponse=awaitenv.AI.run(




"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",



{



prompt:"Build me a Cloudflare Worker that returns JSON.",




stream: true,// Stream a response and don't block the client!



},



);



// Return the stream



returnnewResponse(answer,{




headers:{"content-type":"text/event-stream"},




});



}


}

```

Your Wrangler configuration will need an `ai` binding added:
 * 
 * 

```

{



"ai":{




"binding":"AI"



}


}

```

```


[ai]




binding="AI"


```

### Model routing
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#model-routing)
You can also use the model routing features in AI Gateway directly from an Agent by specifying a `gateway` configuration when calling the AI binding.
Model routing allows you to route requests to different AI models based on whether they are reachable, rate-limiting your client, and/or if you've exceeded your cost budget for a specific provider.
 * 
 * 

src/index.js```


import {Agent} from "agents";




exportclassMyAgentextendsAgent{




asynconRequest(request){




constresponse=awaitenv.AI.run(




"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",



{



prompt:"Build me a Cloudflare Worker that returns JSON.",



},


{



gateway:{




id:"{gateway_id}",// Specify your AI Gateway ID here




skipCache: false,




cacheTtl:3360,



},


},



);




returnResponse.json(response);



}


}

```

src/index.ts```


import {Agent} from "agents";




interfaceEnv{




AI:Ai;



}



exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request){




constresponse=awaitenv.AI.run(




"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",



{



prompt:"Build me a Cloudflare Worker that returns JSON.",



},


{



gateway:{




id:"{gateway_id}",// Specify your AI Gateway ID here




skipCache: false,




cacheTtl:3360,



},


},



);




returnResponse.json(response);



}


}

```

Your Wrangler configuration will need an `ai` binding added. This is shared across both Workers AI and AI Gateway.
 * 
 * 

```

{



"ai":{




"binding":"AI"



}


}

```

```


[ai]




binding="AI"


```

Visit the AI Gateway documentation to learn how to configure a gateway and retrieve a gateway ID.
### AI SDK
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#ai-sdk)
The AI SDK ↗ provides a unified API for using AI models, including for text generation, tool calling, structured responses, image generation, and more.
To use the AI SDK, install the `ai` package and use it within your Agent. The example below shows how it use it to generate text on request, but you can use it from any method within your Agent, including WebSocket handlers, as part of a scheduled task, or even when the Agent is initialized.
 * 
 * 
 * 

Terminal window```


npmiai@ai-sdk/openai


```

Terminal window```


yarnaddai@ai-sdk/openai


```

Terminal window```


pnpmaddai@ai-sdk/openai


```

 * 
 * 

src/index.js```


import {Agent} from "agents";




import {generateText} from "ai";




import {openai} from "@ai-sdk/openai";




exportclassMyAgentextendsAgent{




asynconRequest(request){




const{text}=awaitgenerateText({




model:openai("o3-mini"),




prompt:"Build me an AI agent on Cloudflare Workers",




});




returnResponse.json({ modelResponse:text});



}


}

```

src/index.ts```


import {Agent} from "agents";




import {generateText} from "ai";




import {openai} from "@ai-sdk/openai";




exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request):Promise<Response>{




const{text}=awaitgenerateText({




model:openai("o3-mini"),




prompt:"Build me an AI agent on Cloudflare Workers",




});




returnResponse.json({ modelResponse:text});



}


}

```

### OpenAI compatible endpoints
[](https://developers.cloudflare.com/agents/api-reference/using-ai-models/#openai-compatible-endpoints)
Agents can call models across any service, including those that support the OpenAI API. For example, you can use the OpenAI SDK to use one of Google's Gemini models ↗ directly from your Agent.
Agents can stream responses back over HTTP using Server Sent Events (SSE) from within an `onRequest` handler, or by using the native WebSockets API in your Agent to responses back to a client, which is especially useful for larger models that can take over 30+ seconds to reply.
 * 
 * 

src/index.js```


import {Agent} from "agents";




import {OpenAI} from "openai";




exportclassMyAgentextendsAgent{




asynconRequest(request){




constopenai=newOpenAI({




apiKey:this.env.GEMINI_API_KEY,




baseURL:"https://generativelanguage.googleapis.com/v1beta/openai/",




});



// Create a TransformStream to handle streaming data



let{readable,writable}=newTransformStream();




letwriter=writable.getWriter();




consttextEncoder=newTextEncoder();



// Use ctx.waitUntil to run the async function in the background


// so that it doesn't block the streaming response



ctx.waitUntil(




(async()=>{




conststream=awaitopenai.chat.completions.create({




model:"4o",




messages: [




{ role:"user", content:"Write me a Cloudflare Worker."},




],




stream: true,




});



// loop over the data as it is streamed and write to the writeable



forawait (constpartofstream) {




writer.write(




textEncoder.encode(part.choices[0]?.delta?.content||""),




);



}



writer.close();




})(),




);



// Return the readable stream back to the client



returnnewResponse(readable);



}


}

```

src/index.ts```


import {Agent} from "agents";




import {OpenAI} from "openai";




exportclassMyAgentextendsAgent<Env>{




asynconRequest(request:Request):Promise<Response>{




constopenai=newOpenAI({




apiKey:this.env.GEMINI_API_KEY,




baseURL:"https://generativelanguage.googleapis.com/v1beta/openai/",




});



// Create a TransformStream to handle streaming data



let{readable,writable}=newTransformStream();




letwriter=writable.getWriter();




consttextEncoder=newTextEncoder();



// Use ctx.waitUntil to run the async function in the background


// so that it doesn't block the streaming response



ctx.waitUntil(




(async()=>{




conststream=awaitopenai.chat.completions.create({




model:"4o",




messages: [




{ role:"user", content:"Write me a Cloudflare Worker."},




],




stream: true,




});



// loop over the data as it is streamed and write to the writeable



forawait (constpartofstream) {




writer.write(




textEncoder.encode(part.choices[0]?.delta?.content||""),




);



}



writer.close();




})(),




);



// Return the readable stream back to the client



returnnewResponse(readable);



}


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/using-ai-models.mdx)
Last updated: Aug 19, 2025
 Previous 
Calling Agents Next 
Schedule tasks 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Tools · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/concepts/tools

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.841115

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * What are tools? 
 * Understanding tools 
 * Common tool patterns 

## On this page
 * Overview 
 * What are tools? 
 * Understanding tools 
 * Common tool patterns 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Concepts 
 5. Tools 

Copy page
# Tools
### What are tools?
[](https://developers.cloudflare.com/agents/concepts/tools/#what-are-tools)
Tools enable AI systems to interact with external services and perform actions. They provide a structured way for agents and workflows to invoke APIs, manipulate data, and integrate with external systems. Tools form the bridge between AI decision-making capabilities and real-world actions.
### Understanding tools
[](https://developers.cloudflare.com/agents/concepts/tools/#understanding-tools)
In an AI system, tools are typically implemented as function calls that the AI can use to accomplish specific tasks. For example, a travel booking agent might have tools for:
 * Searching flight availability
 * Checking hotel rates
 * Processing payments
 * Sending confirmation emails

Each tool has a defined interface specifying its inputs, outputs, and expected behavior. This allows the AI system to understand when and how to use each tool appropriately.
### Common tool patterns
[](https://developers.cloudflare.com/agents/concepts/tools/#common-tool-patterns)
#### API integration tools
[](https://developers.cloudflare.com/agents/concepts/tools/#api-integration-tools)
The most common type of tools are those that wrap external APIs. These tools handle the complexity of API authentication, request formatting, and response parsing, presenting a clean interface to the AI system.
#### Model Context Protocol (MCP)
[](https://developers.cloudflare.com/agents/concepts/tools/#model-context-protocol-mcp)
The Model Context Protocol ↗ provides a standardized way to define and interact with tools. Think of it as an abstraction on top of APIs designed for LLMs to interact with external resources. MCP defines a consistent interface for:
 * **Tool Discovery** : Systems can dynamically discover available tools
 * **Parameter Validation** : Tools specify their input requirements using JSON Schema
 * **Error Handling** : Standardized error reporting and recovery
 * **State Management** : Tools can maintain state across invocations

#### Data processing tools
[](https://developers.cloudflare.com/agents/concepts/tools/#data-processing-tools)
Tools that handle data transformation and analysis are essential for many AI workflows. These might include:
 * CSV parsing and analysis
 * Image processing
 * Text extraction
 * Data validation

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/concepts/tools.mdx)
Last updated: Feb 28, 2025
 Previous 
Workflows Next 
Human in the Loop 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Agents API · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/api-reference/agents-api

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.842497

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Agent class API 
 * WebSocket API 
 * State synchronization API 
 * Scheduling API 
 * SQL API 
 * Client API 
 * React API 
 * Chat Agent 
 * Chat Agent React API 
 * Next steps 

## On this page
 * Overview 
 * Agent class API 
 * WebSocket API 
 * State synchronization API 
 * Scheduling API 
 * SQL API 
 * Client API 
 * React API 
 * Chat Agent 
 * Chat Agent React API 
 * Next steps 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. API Reference 
 5. Agents API 

Copy page
# Agents API
This page provides an overview of the Agent SDK API, including the `Agent` class, methods and properties built-in to the Agents SDK.
The Agents SDK exposes two main APIs:
 * The server-side `Agent` class. An Agent encapsulates all of the logic for an Agent, including how clients can connect to it, how it stores state, the methods it exposes, how to call AI models, and any error handling.
 * The client-side `AgentClient` class, which allows you to connect to an Agent instance from a client-side application. The client APIs also include React hooks, including `useAgent` and `useAgentChat`, and allow you to automatically synchronize state between each unique Agent (running server-side) and your client applications.

Agents require Cloudflare Durable Objects, see Configuration to learn how to add the required bindings to your project.
You can also find more specific usage examples for each API in the Agents API Reference.
 * 
 * 

JavaScript```


import {Agent} from "agents";




classMyAgentextendsAgent{



// Define methods on the Agent


}



exportdefaultMyAgent;


```

TypeScript```


import {Agent} from "agents";




classMyAgentextendsAgent{



// Define methods on the Agent


}



exportdefaultMyAgent;


```

An Agent can have many (millions of) instances: each instance is a separate micro-server that runs independently of the others. This allows Agents to scale horizontally: an Agent can be associated with a single user, or many thousands of users, depending on the agent you're building.
Instances of an Agent are addressed by a unique identifier: that identifier (ID) can be the user ID, an email address, GitHub username, a flight ticket number, an invoice ID, or any other identifier that helps to uniquely identify the instance and for whom it is acting on behalf of.
An instance of an Agent is globally unique: given the same name (or ID), you will always get the same instance of an agent.
This allows you to avoid synchronizing state across requests: if an Agent instance represents a specific user, team, channel or other entity, you can use the Agent instance to store state for that entity. No need to set up a centralized session store.
If the client disconnects, you can always route the client back to the exact same Agent and pick up where they left off.
### Agent class API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#agent-class-api)
Writing an Agent requires you to define a class that extends the `Agent` class from the Agents SDK package. An Agent encapsulates all of the logic for an Agent, including how clients can connect to it, how it stores state, the methods it exposes, and any error handling.
You can also define your own methods on an Agent: it's technically valid to publish an Agent only has your own methods exposed, and create/get Agents directly from a Worker.
Your own methods can access the Agent's environment variables and bindings on `this.env`, state on `this.setState`, and call other methods on the Agent via `this.yourMethodName`.
 * 
 * 

JavaScript```


import {Agent} from "agents";



// Pass the Env as a TypeScript type argument


// Any services connected to your Agent or Worker as Bindings


// are then available on this.env.<BINDING_NAME>


// The core class for creating Agents that can maintain state, orchestrate


// complex AI workflows, schedule tasks, and interact with users and other


// Agents.



classMyAgentextendsAgent{



// Optional initial state definition



initialState ={




counter:0,




messages: [],




lastUpdated:null,



};


// Called when a new Agent instance starts or wakes from hibernation



asynconStart(){




console.log("Agent started with state:",this.state);



}


// Handle HTTP requests coming to this Agent instance


// Returns a Response object



asynconRequest(request){




returnnewResponse("Hello from Agent!");



}


// Called when a WebSocket connection is established


// Access the original request via ctx.request for auth etc.



asynconConnect(connection,ctx){



// Connections are automatically accepted by the SDK.


// You can also explicitly close a connection here with connection.close()


// Access the Request on ctx.request to inspect headers, cookies and the URL


}


// Called for each message received on a WebSocket connection


// Message can be string, ArrayBuffer, or ArrayBufferView



asynconMessage(connection,message){



// Handle incoming messages



connection.send("Received your message");



}


// Handle WebSocket connection errors



asynconError(connection,error){




console.error(`Connection error:`,error);



}


// Handle WebSocket connection close events



asynconClose(connection,code,reason,wasClean){




console.log(`Connection closed: ${code} - ${reason}`);



}


// Called when the Agent's state is updated from any source


// source can be "server" or a client Connection



onStateUpdate(state,source){




console.log("State updated:",state,"Source:",source);



}


// You can define your own custom methods to be called by requests,


// WebSocket messages, or scheduled tasks



asynccustomProcessingMethod(data){



// Process data, update state, schedule tasks, etc.



this.setState({...this.state, lastUpdated:newDate() });



}


}

```

TypeScript```


import {Agent} from "agents";




interfaceEnv{



// Define environment variables & bindings here


}


// Pass the Env as a TypeScript type argument


// Any services connected to your Agent or Worker as Bindings


// are then available on this.env.<BINDING_NAME>


// The core class for creating Agents that can maintain state, orchestrate


// complex AI workflows, schedule tasks, and interact with users and other


// Agents.



classMyAgentextendsAgent<Env,State>{



// Optional initial state definition



initialState ={




counter:0,




messages: [],




lastUpdated:null



};


// Called when a new Agent instance starts or wakes from hibernation



asynconStart(){




console.log('Agent started with state:',this.state);



}


// Handle HTTP requests coming to this Agent instance


// Returns a Response object



asynconRequest(request:Request):Promise<Response>{




returnnewResponse("Hello from Agent!");



}


// Called when a WebSocket connection is established


// Access the original request via ctx.request for auth etc.



asynconConnect(connection:Connection,ctx:ConnectionContext){



// Connections are automatically accepted by the SDK.


// You can also explicitly close a connection here with connection.close()


// Access the Request on ctx.request to inspect headers, cookies and the URL


}


// Called for each message received on a WebSocket connection


// Message can be string, ArrayBuffer, or ArrayBufferView



asynconMessage(connection:Connection,message:WSMessage){



// Handle incoming messages



connection.send("Received your message");



}


// Handle WebSocket connection errors



asynconError(connection:Connection,error:unknown):Promise<void>{




console.error(`Connection error:`,error);



}


// Handle WebSocket connection close events



asynconClose(connection:Connection,code:number,reason:string,wasClean:boolean):Promise<void>{




console.log(`Connection closed: ${code} - ${reason}`);



}


// Called when the Agent's state is updated from any source


// source can be "server" or a client Connection



onStateUpdate(state:State,source:"server"|Connection){




console.log("State updated:",state,"Source:",source);



}


// You can define your own custom methods to be called by requests,


// WebSocket messages, or scheduled tasks



asynccustomProcessingMethod(data:any){



// Process data, update state, schedule tasks, etc.



this.setState({...this.state, lastUpdated:newDate() });



}


}

```

 * 
 * 

JavaScript```

// Basic Agent implementation with custom methods



import {Agent} from "agents";




classMyAgentextendsAgent{




initialState ={




counter:0,




lastUpdated:null,



};



asynconRequest(request){




if (request.method==="POST") {




awaitthis.incrementCounter();




returnnewResponse(JSON.stringify(this.state),{




headers:{"Content-Type":"application/json"},




});



}



returnnewResponse(JSON.stringify(this.state),{




headers:{"Content-Type":"application/json"},




});



}



asyncincrementCounter(){




this.setState({




counter:this.state.counter+1,




lastUpdated:newDate(),




});



}


}

```

TypeScript```

// Basic Agent implementation with custom methods



import {Agent} from "agents";




interfaceMyState{




counter:number;




lastUpdated:Date|null;



}



classMyAgentextendsAgent<Env,MyState>{




initialState ={




counter:0,




lastUpdated:null



};



asynconRequest(request:Request){




if (request.method==="POST") {




awaitthis.incrementCounter();




returnnewResponse(JSON.stringify(this.state),{




headers:{"Content-Type":"application/json"}




});



}



returnnewResponse(JSON.stringify(this.state),{




headers:{"Content-Type":"application/json"}




});



}



asyncincrementCounter(){




this.setState({




counter:this.state.counter+1,




lastUpdated:newDate()




});



}


}

```

### WebSocket API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#websocket-api)
The WebSocket API allows you to accept and manage WebSocket connections made to an Agent.
#### Connection
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#connection)
Represents a WebSocket connection to an Agent.
TypeScript```

// WebSocket connection interface



interfaceConnection<State=unknown>{



// Unique ID for this connection



id:string;



// Client-specific state attached to this connection



state:State;



// Update the connection's state



setState(state:State):void;



// Accept an incoming WebSocket connection



accept():void;



// Close the WebSocket connection with optional code and reason



close(code?:number,reason?:string):void;



// Send a message to the client


// Can be string, ArrayBuffer, or ArrayBufferView



send(message:string|ArrayBuffer|ArrayBufferView):void;



}

```

 * 
 * 

JavaScript```

// Example of handling WebSocket messages



exportclassYourAgentextendsAgent{




asynconMessage(connection,message){




if (typeofmessage==="string") {




try{



// Parse JSON message



constdata=JSON.parse(message);




if (data.type==="update") {



// Update connection-specific state



connection.setState({...connection.state, lastActive:Date.now() });



// Update global Agent state



this.setState({




...this.state,




connections:this.state.connections+1,




});



// Send response back to this client only



connection.send(




JSON.stringify({




type:"updated",




status:"success",




}),




);



}



}catch (e) {




connection.send(JSON.stringify({ error:"Invalid message format"}));



}


}


}


}

```

TypeScript```

// Example of handling WebSocket messages



exportclassYourAgentextendsAgent{




asynconMessage(connection:Connection,message:WSMessage){




if (typeofmessage==='string') {




try{



// Parse JSON message



constdata=JSON.parse(message);




if (data.type==='update') {



// Update connection-specific state



connection.setState({...connection.state, lastActive:Date.now() });



// Update global Agent state



this.setState({




...this.state,




connections:this.state.connections+1




});



// Send response back to this client only



connection.send(JSON.stringify({




type:'updated',




status:'success'




}));



}



}catch (e) {




connection.send(JSON.stringify({ error:'Invalid message format'}));



}


}


}


}

```

#### WSMessage
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#wsmessage)
Types of messages that can be received from a WebSocket.
TypeScript```

// Types of messages that can be received from WebSockets



typeWSMessage=string|ArrayBuffer|ArrayBufferView;


```

#### ConnectionContext
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#connectioncontext)
Context information for a WebSocket connection.
TypeScript```

// Context available during WebSocket connection



interfaceConnectionContext{



// The original HTTP request that initiated the WebSocket connection



request:Request;



}

```

### State synchronization API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#state-synchronization-api)
To learn more about how to manage state within an Agent, refer to the documentation on managing and syncing state.
#### State
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#state)
Methods and types for managing Agent state.
TypeScript```

// State management in the Agent class



classAgent<Env,State=unknown>{



// Initial state that will be set if no state exists yet



initialState:State={}asunknownasState;



// Current state of the Agent, persisted across restarts



getstate():State;



// Update the Agent's state


// Persists to storage and notifies all connected clients



setState(state:State):void;



// Called when state is updated from any source


// Override to react to state changes



onStateUpdate(state:State,source:"server"|Connection):void;



}

```

 * 
 * 

JavaScript```

// Example of state management in an Agent


// Inside your Agent class



exportclassYourAgentextendsAgent{




asyncaddMessage(sender,text){



// Update state with new message



this.setState({




...this.state,




messages: [




...this.state.messages,




{sender,text, timestamp:Date.now() },




].slice(-this.state.settings.maxHistoryLength),// Maintain max history




});



// The onStateUpdate method will automatically be called


// and all connected clients will receive the update


}


// Override onStateUpdate to add custom behavior when state changes



onStateUpdate(state,source){




console.log(




`State updated by ${source==="server"?"server":"client"}`,




);



// You could trigger additional actions based on state changes



if (state.messages.length>0) {




constlastMessage=state.messages[state.messages.length-1];




if (lastMessage.text.includes("@everyone")) {




this.notifyAllParticipants(lastMessage);



}


}


}


}

```

TypeScript```

// Example of state management in an Agent



interfaceChatState{




messages:Array<{ sender:string; text:string; timestamp:number}>;




participants:string[];




settings:{




allowAnonymous:boolean;




maxHistoryLength:number;



};


}



interfaceEnv{



// Your bindings and environment variables


}


// Inside your Agent class



exportclassYourAgentextendsAgent<Env,ChatState>{




asyncaddMessage(sender:string,text:string){



// Update state with new message



this.setState({




...this.state,




messages: [




...this.state.messages,




{sender,text, timestamp:Date.now() }




].slice(-this.state.settings.maxHistoryLength) // Maintain max history




});



// The onStateUpdate method will automatically be called


// and all connected clients will receive the update


}


// Override onStateUpdate to add custom behavior when state changes



onStateUpdate(state:ChatState,source:"server"|Connection){




console.log(`State updated by ${source==="server"?"server":"client"}`);



// You could trigger additional actions based on state changes



if (state.messages.length>0) {




constlastMessage=state.messages[state.messages.length-1];




if (lastMessage.text.includes('@everyone')) {




this.notifyAllParticipants(lastMessage);



}


}


}


}

```

### Scheduling API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#scheduling-api)
#### Scheduling tasks
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#scheduling-tasks)
Schedule tasks to run at a specified time in the future.
TypeScript```

// Scheduling API for running tasks in the future



classAgent<Env,State=unknown>{



// Schedule a task to run in the future


// when: seconds from now, specific Date, or cron expression


// callback: method name on the Agent to call


// payload: data to pass to the callback


// Returns a Schedule object with the task ID



asyncschedule<T=any>(




when:Date|string|number,




callback:keyofthis,




payload?:T




):Promise<Schedule<T>>;



// Get a scheduled task by ID


// Returns undefined if the task doesn't exist



asyncgetSchedule<T=any>(id:string):Promise<Schedule<T>|undefined>;



// Get all scheduled tasks matching the criteria


// Returns an array of Schedule objects



getSchedules<T=any>(criteria?:{




description?:string;




id?:string;




type?:"scheduled"|"delayed"|"cron";




timeRange?:{ start?:Date; end?:Date};




}):Schedule<T>[];



// Cancel a scheduled task by ID


// Returns true if the task was cancelled, false otherwise



asynccancelSchedule(id:string):Promise<boolean>;



}

```

 * 
 * 

JavaScript```

// Example of scheduling in an Agent



exportclassYourAgentextendsAgent{



// Schedule a one-time reminder in 2 hours



asyncscheduleReminder(userId,message){




consttwoHoursFromNow=newDate(Date.now() +2*60*60*1000);




constschedule=awaitthis.schedule(twoHoursFromNow,"sendReminder",{




userId,




message,




channel:"email",




});




console.log(`Scheduled reminder with ID: ${schedule.id}`);




returnschedule.id;



}


// Schedule a recurring daily task using cron



asyncscheduleDailyReport(){



// Run at 08:00 AM every day



constschedule=awaitthis.schedule(




"0 8 * * *",// Cron expression: minute hour day month weekday




"generateDailyReport",




{ reportType:"daily-summary"},




);




console.log(`Scheduled daily report with ID: ${schedule.id}`);




returnschedule.id;



}


// Method that will be called when the scheduled task runs



asyncsendReminder(data){




console.log(`Sending reminder to ${data.userId}: ${data.message}`);



// Add code to send the actual notification


}


}

```

TypeScript```

// Example of scheduling in an Agent



interfaceReminderData{




userId:string;




message:string;




channel:string;



}



exportclassYourAgentextendsAgent{



// Schedule a one-time reminder in 2 hours



asyncscheduleReminder(userId:string,message:string){




consttwoHoursFromNow=newDate(Date.now() +2*60*60*1000);




constschedule=awaitthis.schedule<ReminderData>(




twoHoursFromNow,




'sendReminder',




{userId,message, channel:'email'}




);




console.log(`Scheduled reminder with ID: ${schedule.id}`);




returnschedule.id;



}


// Schedule a recurring daily task using cron



asyncscheduleDailyReport(){



// Run at 08:00 AM every day



constschedule=awaitthis.schedule(




'0 8 * * *',// Cron expression: minute hour day month weekday




'generateDailyReport',




{ reportType:'daily-summary'}




);




console.log(`Scheduled daily report with ID: ${schedule.id}`);




returnschedule.id;



}


// Method that will be called when the scheduled task runs



asyncsendReminder(data:ReminderData){




console.log(`Sending reminder to ${data.userId}: ${data.message}`);



// Add code to send the actual notification


}


}

```

#### Schedule object
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#schedule-object)
Represents a scheduled task.
TypeScript```

// Represents a scheduled task



typeSchedule<T=any>={



// Unique identifier for the schedule



id:string;



// Name of the method to be called



callback:string;



// Data to be passed to the callback



payload:T;




}& (




|{



// One-time execution at a specific time



type:"scheduled";



// Timestamp when the task should execute



time:number;



}



|{



// Delayed execution after a certain time



type:"delayed";



// Timestamp when the task should execute



time:number;



// Number of seconds to delay execution



delayInSeconds:number;



}



|{



// Recurring execution based on cron expression



type:"cron";



// Timestamp for the next execution



time:number;



// Cron expression defining the schedule



cron:string;



}



);


```

 * 
 * 

JavaScript```


exportclassYourAgentextendsAgent{



// Example of managing scheduled tasks



asyncviewAndManageSchedules(){



// Get all scheduled tasks



constallSchedules=this.getSchedules();




console.log(`Total scheduled tasks: ${allSchedules.length}`);



// Get tasks scheduled for a specific time range



constupcomingSchedules=this.getSchedules({




timeRange:{




start:newDate(),




end:newDate(Date.now() +24*60*60*1000),// Next 24 hours



},



});



// Get a specific task by ID



consttaskId="task-123";




constspecificTask=awaitthis.getSchedule(taskId);




if (specificTask) {




console.log(




`Found task: ${specificTask.callback} at ${newDate(specificTask.time)}`,




);



// Cancel a scheduled task



constcancelled=awaitthis.cancelSchedule(taskId);




console.log(`Task cancelled: ${cancelled}`);



}


}


}

```

TypeScript```


exportclassYourAgentextendsAgent{



// Example of managing scheduled tasks



asyncviewAndManageSchedules(){



// Get all scheduled tasks



constallSchedules=this.getSchedules();




console.log(`Total scheduled tasks: ${allSchedules.length}`);



// Get tasks scheduled for a specific time range



constupcomingSchedules=this.getSchedules({




timeRange:{




start:newDate(),




end:newDate(Date.now() +24*60*60*1000) // Next 24 hours



}



});



// Get a specific task by ID



consttaskId="task-123";




constspecificTask=awaitthis.getSchedule(taskId);




if (specificTask) {




console.log(`Found task: ${specificTask.callback} at ${newDate(specificTask.time)}`);



// Cancel a scheduled task



constcancelled=awaitthis.cancelSchedule(taskId);




console.log(`Task cancelled: ${cancelled}`);



}


}


}

```

### SQL API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#sql-api)
Each Agent instance has an embedded SQLite database that can be accessed using the `this.sql` method within any method on your `Agent` class.
#### SQL queries
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#sql-queries)
Execute SQL queries against the Agent's built-in SQLite database using the `this.sql` method within any method on your `Agent` class.
TypeScript```

// SQL query API for the Agent's embedded database



classAgent<Env,State=unknown>{



// Execute a SQL query with tagged template literals


// Returns an array of rows matching the query



sql<T=Record<string,string|number|boolean|null>>(




strings:TemplateStringsArray,




...values: (string|number|boolean|null)[]




):T[];



}

```

 * 
 * 

JavaScript```

// Example of using SQL in an Agent



exportclassYourAgentextendsAgent{




asyncsetupDatabase(){



// Create a table if it doesn't exist



this.sql`



CREATE TABLE IF NOT EXISTS users (


id TEXT PRIMARY KEY,


name TEXT NOT NULL,


email TEXT UNIQUE,


created_at INTEGER


)



`;



}



asynccreateUser(id,name,email){



// Insert a new user



this.sql`



INSERT INTO users (id, name, email, created_at)



VALUES (${id}, ${name}, ${email}, ${Date.now()})




`;



}



asyncgetUserById(id){



// Query a user by ID



constusers=this.sql`




SELECT * FROM users WHERE id = ${id}




`;




returnusers.length?users[0] :null;



}



asyncsearchUsers(term){



// Search users with a wildcard



returnthis.sql`



SELECT * FROM users



WHERE name LIKE ${"%"+term+"%"} OR email LIKE ${"%"+term+"%"}



ORDER BY created_at DESC



`;



}


}

```

TypeScript```

// Example of using SQL in an Agent



interfaceUser{




id:string;




name:string;




email:string;




created_at:number;



}



exportclassYourAgentextendsAgent{




asyncsetupDatabase(){



// Create a table if it doesn't exist



this.sql`



CREATE TABLE IF NOT EXISTS users (


id TEXT PRIMARY KEY,


name TEXT NOT NULL,


email TEXT UNIQUE,


created_at INTEGER


)



`;



}



asynccreateUser(id:string,name:string,email:string){



// Insert a new user



this.sql`



INSERT INTO users (id, name, email, created_at)



VALUES (${id}, ${name}, ${email}, ${Date.now()})




`;



}



asyncgetUserById(id:string):Promise<User|null>{



// Query a user by ID



constusers=this.sql<User>`




SELECT * FROM users WHERE id = ${id}




`;




returnusers.length?users[0] :null;



}



asyncsearchUsers(term:string):Promise<User[]>{



// Search users with a wildcard



returnthis.sql<User>`



SELECT * FROM users



WHERE name LIKE ${'%'+term+'%'} OR email LIKE ${'%'+term+'%'}



ORDER BY created_at DESC



`;



}


}

```

Visit the state management API documentation within the Agents SDK, including the native `state` APIs and the built-in `this.sql` API for storing and querying data within your Agents.
### Client API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#client-api)
The Agents SDK provides a set of client APIs for interacting with Agents from client-side JavaScript code, including:
 * React hooks, including `useAgent` and `useAgentChat`, for connecting to Agents from client applications.
 * Client-side state syncing that allows you to subscribe to state updates between the Agent and any connected client(s) when calling `this.setState` within your Agent's code.
 * The ability to call remote methods (Remote Procedure Calls; RPC) on the Agent from client-side JavaScript code using the `@callable` method decorator.

#### AgentClient
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#agentclient)
Client for connecting to an Agent from the browser.
TypeScript```


import {AgentClient} from "agents/client";



// Options for creating an AgentClient



typeAgentClientOptions=Omit<PartySocketOptions,"party"|"room">&{



// Name of the agent to connect to (class name in kebab-case)



agent:string;



// Name of the specific Agent instance (optional, defaults to "default")



name?:string;



// Other WebSocket options like host, protocol, etc.


};


// WebSocket client for connecting to an Agent



classAgentClientextendsPartySocket{




staticfetch(opts:PartyFetchOptions):Promise<Response>;




constructor(opts:AgentClientOptions);



}

```

 * 
 * 

JavaScript```

// Example of using AgentClient in the browser



import {AgentClient} from "agents/client";



// Connect to an Agent instance



constclient=newAgentClient({




agent:"chat-agent",// Name of your Agent class in kebab-case




name:"support-room-123",// Specific instance name




host:window.location.host,// Using same host




});




client.onopen=()=>{




console.log("Connected to agent");



// Send an initial message



client.send(JSON.stringify({ type:"join", user:"user123"}));



};



client.onmessage=(event)=>{



// Handle incoming messages



constdata=JSON.parse(event.data);




console.log("Received:",data);




if (data.type==="state_update") {



// Update local UI with new state



updateUI(data.state);



}


};



client.onclose=()=>console.log("Disconnected from agent");



// Send messages to the Agent



functionsendMessage(text){




client.send(




JSON.stringify({




type:"message",




text,




timestamp:Date.now(),




}),




);



}

```

TypeScript```

// Example of using AgentClient in the browser



import {AgentClient} from "agents/client";



// Connect to an Agent instance



constclient=newAgentClient({




agent:"chat-agent",// Name of your Agent class in kebab-case




name:"support-room-123",// Specific instance name




host:window.location.host,// Using same host




});




client.onopen=()=>{




console.log("Connected to agent");



// Send an initial message



client.send(JSON.stringify({ type:"join", user:"user123"}));



};



client.onmessage=(event)=>{



// Handle incoming messages



constdata=JSON.parse(event.data);




console.log("Received:",data);




if (data.type==="state_update") {



// Update local UI with new state



updateUI(data.state);



}


};



client.onclose=()=>console.log("Disconnected from agent");



// Send messages to the Agent



functionsendMessage(text){




client.send(JSON.stringify({




type:"message",




text,




timestamp:Date.now()




}));



}

```

#### agentFetch
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#agentfetch)
Make an HTTP request to an Agent.
TypeScript```


import {agentFetch} from "agents/client";



// Options for the agentFetch function



typeAgentClientFetchOptions=Omit<PartyFetchOptions,"party"|"room">&{



// Name of the agent to connect to



agent:string;



// Name of the specific Agent instance (optional)



name?:string;



};


// Make an HTTP request to an Agent



functionagentFetch(




opts:AgentClientFetchOptions,




init?:RequestInit




):Promise<Response>;


```

 * 
 * 

JavaScript```

// Example of using agentFetch in the browser



import {agentFetch} from "agents/client";



// Function to get data from an Agent



asyncfunctionfetchAgentData(){




try{




constresponse=awaitagentFetch(



{



agent:"task-manager",




name:"user-123-tasks",



},


{



method:"GET",




headers:{




Authorization:`Bearer ${userToken}`,



},


},



);




if (!response.ok) {




thrownewError(`Error: ${response.status}`);



}



constdata=awaitresponse.json();




returndata;




}catch (error) {




console.error("Failed to fetch from agent:",error);



}


}

```

TypeScript```

// Example of using agentFetch in the browser



import {agentFetch} from "agents/client";



// Function to get data from an Agent



asyncfunctionfetchAgentData(){




try{




constresponse=awaitagentFetch(



{



agent:"task-manager",




name:"user-123-tasks"



},


{



method:"GET",




headers:{




"Authorization":`Bearer ${userToken}`



}


}



);




if (!response.ok) {




thrownewError(`Error: ${response.status}`);



}



constdata=awaitresponse.json();




returndata;




}catch (error) {




console.error("Failed to fetch from agent:",error);



}


}

```

### React API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#react-api)
The Agents SDK provides a React API for simplifying connection and routing to Agents from front-end frameworks, including React Router (Remix), Next.js, and Astro.
#### useAgent
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#useagent)
React hook for connecting to an Agent.
TypeScript```


import {useAgent} from "agents/react";



// Options for the useAgent hook



typeUseAgentOptions<State=unknown>=Omit<




Parameters<typeofusePartySocket>[0],




"party"|"room"




>&{



// Name of the agent to connect to



agent:string;



// Name of the specific Agent instance (optional)



name?:string;



// Called when the Agent's state is updated



onStateUpdate?:(state:State,source:"server"|"client")=>void;



};


// React hook for connecting to an Agent


// Returns a WebSocket connection with setState method



functionuseAgent<State=unknown>(




options:UseAgentOptions<State>




):PartySocket&{



// Update the Agent's state



setState:(state:State)=>void



};

```

### Chat Agent
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#chat-agent)
The Agents SDK exposes an `AIChatAgent` class that extends the `Agent` class and exposes an `onChatMessage` method that simplifies building interactive chat agents.
You can combine this with the `useAgentChat` React hook from the `agents/ai-react` package to manage chat state and messages between a user and your Agent(s).
#### AIChatAgent
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#aichatagent)
Extension of the `Agent` class with built-in chat capabilities.
TypeScript```


import {AIChatAgent} from "agents/ai-chat-agent";




import {Message,StreamTextOnFinishCallback,ToolSet} from "ai";



// Base class for chat-specific agents



classAIChatAgent<Env=unknown,State=unknown>extendsAgent<Env,State>{



// Array of chat messages for the current conversation



messages:Message[];



// Handle incoming chat messages and generate a response


// onFinish is called when the response is complete



asynconChatMessage(




onFinish:StreamTextOnFinishCallback<ToolSet>




):Promise<Response|undefined>;



// Persist messages within the Agent's local storage.



asyncsaveMessages(messages:Message[]):Promise<void>;



}

```

 * 
 * 

JavaScript```

// Example of extending AIChatAgent



import {AIChatAgent} from "agents/ai-chat-agent";




import {Message} from "ai";




classCustomerSupportAgentextendsAIChatAgent{



// Override the onChatMessage method to customize behavior



asynconChatMessage(onFinish){



// Access the AI models using environment bindings



const{openai}=this.env.AI;



// Get the current conversation history



constchatHistory=this.messages;



// Generate a system prompt based on knowledge base



constsystemPrompt=awaitthis.generateSystemPrompt();



// Generate a response stream



conststream=awaitopenai.chat({




model:"gpt-4o",




messages: [{ role:"system", content:systemPrompt},...chatHistory],




stream: true,




});



// Return the streaming response



returnnewResponse(stream,{




headers:{"Content-Type":"text/event-stream"},




});



}


// Helper method to generate a system prompt



asyncgenerateSystemPrompt(){



// Query knowledge base or use static prompt



return`You are a helpful customer support agent.



Respond to customer inquiries based on the following guidelines:


- Be friendly and professional


- If you don't know an answer, say so



- Current company policies: ...`;



}


}

```

TypeScript```

// Example of extending AIChatAgent



import {AIChatAgent} from "agents/ai-chat-agent";




import {Message} from "ai";




interfaceEnv{




AI:any;// Your AI binding



}



classCustomerSupportAgentextendsAIChatAgent<Env>{



// Override the onChatMessage method to customize behavior



asynconChatMessage(onFinish){



// Access the AI models using environment bindings



const{openai}=this.env.AI;



// Get the current conversation history



constchatHistory=this.messages;



// Generate a system prompt based on knowledge base



constsystemPrompt=awaitthis.generateSystemPrompt();



// Generate a response stream



conststream=awaitopenai.chat({




model:"gpt-4o",




messages: [




{ role:"system", content:systemPrompt},



...chatHistory



],




stream: true




});



// Return the streaming response



returnnewResponse(stream,{




headers:{"Content-Type":"text/event-stream"}




});



}


// Helper method to generate a system prompt



asyncgenerateSystemPrompt(){



// Query knowledge base or use static prompt



return`You are a helpful customer support agent.



Respond to customer inquiries based on the following guidelines:


- Be friendly and professional


- If you don't know an answer, say so



- Current company policies: ...`;



}


}

```

### Chat Agent React API
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#chat-agent-react-api)
#### useAgentChat
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#useagentchat)
React hook for building AI chat interfaces using an Agent.
TypeScript```


import {useAgentChat} from "agents/ai-react";




import {useAgent} from "agents/react";




import type {Message} from "ai";



// Options for the useAgentChat hook



typeUseAgentChatOptions=Omit<




Parameters<typeofuseChat>[0] &{



// Agent connection from useAgent



agent:ReturnType<typeofuseAgent>;



},


"fetch"


>;


// React hook for building AI chat interfaces using an Agent



functionuseAgentChat(options:UseAgentChatOptions):{



// Current chat messages



messages:Message[];



// Set messages and synchronize with the Agent



setMessages:(messages:Message[])=>void;



// Clear chat history on both client and Agent



clearHistory:()=>void;



// Append a new message to the conversation



append:(message:Message,chatRequestOptions?:any)=>Promise<string|null|undefined>;



// Reload the last user message



reload:(chatRequestOptions?:any)=>Promise<string|null|undefined>;



// Stop the AI response generation



stop:()=>void;



// Current input text



input:string;



// Set the input text



setInput:React.Dispatch<React.SetStateAction<string>>;



// Handle input changes



handleInputChange:(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>void;



// Submit the current input



handleSubmit:(event?:{preventDefault?:()=>void},chatRequestOptions?:any)=>void;



// Additional metadata



metadata?:Object;



// Whether a response is currently being generated



isLoading:boolean;



// Current status of the chat



status:"submitted"|"streaming"|"ready"|"error";



// Tool data from the AI response



data?:any[];



// Set tool data



setData:(data:any[] |undefined| ((data:any[] |undefined)=>any[] |undefined))=>void;



// Unique ID for the chat



id:string;



// Add a tool result for a specific tool call



addToolResult: ({ toolCallId, result }:{ toolCallId:string; result:any}) =>void;



// Current error if any



error:Error|undefined;



};

```

 * 
 * 

JavaScript```

// Example of using useAgentChat in a React component



import {useAgentChat} from "agents/ai-react";




import {useAgent} from "agents/react";




import {useState} from "react";




functionChatInterface(){



// Connect to the chat agent



constagentConnection=useAgent({




agent:"customer-support",




name:"session-12345",




});



// Use the useAgentChat hook with the agent connection



const{




messages,




input,




handleInputChange,




handleSubmit,




isLoading,




error,




clearHistory,




}=useAgentChat({




agent:agentConnection,




initialMessages: [




{ role:"system", content:"You're chatting with our AI assistant."},




{ role:"assistant", content:"Hello! How can I help you today?"},




],




});




return (




<divclassName="chat-container">




<divclassName="message-history">




{messages.map((message, i) => (




<divkey={i} className={`message ${message.role}`}>




{message.role==="user"?"👤":"🤖"} {message.content}




</div>



))}



{isLoading&& <divclassName="loading">AI is typing...</div>}




{error&& <divclassName="error">Error: {error.message}</div>}




</div>




<formonSubmit={handleSubmit} className="message-input">




<input




value={input}




onChange={handleInputChange}




placeholder="Type your message..."




disabled={isLoading}



/>



<buttontype="submit"disabled={isLoading||!input.trim()}>



Send



</button>




<buttontype="button"onClick={clearHistory}>



Clear Chat



</button>




</form>




</div>




);



}

```

TypeScript```

// Example of using useAgentChat in a React component



import {useAgentChat} from "agents/ai-react";




import {useAgent} from "agents/react";




import {useState} from "react";




functionChatInterface(){



// Connect to the chat agent



constagentConnection=useAgent({




agent:"customer-support",




name:"session-12345"




});



// Use the useAgentChat hook with the agent connection



const{




messages,




input,




handleInputChange,




handleSubmit,




isLoading,




error,



clearHistory



}=useAgentChat({




agent:agentConnection,




initialMessages: [




{ role:"system", content:"You're chatting with our AI assistant."},




{ role:"assistant", content:"Hello! How can I help you today?"}



]



});




return (




<divclassName="chat-container">




<divclassName="message-history">




{messages.map((message,i) => (




<divkey={i}className={`message ${message.role}`}>




{message.role === 'user' ? '👤':'🤖'}{message.content}



</div>



))}




{isLoading && <divclassName="loading">AIistyping...</div>}




{error && <divclassName="error">Error: {error.message}</div>}



</div>



<formonSubmit={handleSubmit}className="message-input">




<input




value={input}




onChange={handleInputChange}




placeholder="Type your message..."




disabled={isLoading}



/>



<buttontype="submit"disabled={isLoading || !input.trim()}>



Send


</button>



<buttontype="button"onClick={clearHistory}>




ClearChat



</button>


</form>


</div>



);



}

```

### Next steps
[](https://developers.cloudflare.com/agents/api-reference/agents-api/#next-steps)
 * Build a chat Agent using the Agents SDK and deploy it to Workers.
 * Learn more using WebSockets to build interactive Agents and stream data back from your Agent.
 * Orchestrate asynchronous workflows from your Agent by combining the Agents SDK and Workflows.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/api-reference/agents-api.mdx)
Last updated: Aug 20, 2025
 Previous 
API Reference Next 
Calling Agents 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Agents · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/concepts/what-are-agents

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.842750

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * What are agents? 
 * Example: Booking vacations 
 * Three primary components of agent systems: 

## On this page
 * Overview 
 * What are agents? 
 * Example: Booking vacations 
 * Three primary components of agent systems: 

## Tags
 AI LLM 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Concepts 
 5. Agents 

Copy page
# Agents
### What are agents?
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#what-are-agents)
An agent is an AI system that can autonomously execute tasks by making decisions about tool usage and process flow. Unlike traditional automation that follows predefined paths, agents can dynamically adapt their approach based on context and intermediate results. Agents are also distinct from co-pilots (e.g. traditional chat applications) in that they can fully automate a task, as opposed to simply augmenting and extending human input.
 * **Agents** → non-linear, non-deterministic (can change from run to run)
 * **Workflows** → linear, deterministic execution paths
 * **Co-pilots** → augmentative AI assistance requiring human intervention

### Example: Booking vacations
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#example-booking-vacations)
If this is your first time working with, or interacting with agents, this example will illustrate how an agent works within a context like booking a vacation. If you are already familiar with the topic, read on.
Imagine you're trying to book a vacation. You need to research flights, find hotels, check restaurant reviews, and keep track of your budget.
#### Traditional workflow automation
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#traditional-workflow-automation)
A traditional automation system follows a predetermined sequence:
 * Takes specific inputs (dates, location, budget)
 * Calls predefined API endpoints in a fixed order
 * Returns results based on hardcoded criteria
 * Cannot adapt if unexpected situations arise

!Traditional workflow automation diagram
#### AI Co-pilot
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#ai-co-pilot)
A co-pilot acts as an intelligent assistant that:
 * Provides hotel and itinerary recommendations based on your preferences
 * Can understand and respond to natural language queries
 * Offers guidance and suggestions
 * Requires human decision-making and action for execution

!A co-pilot diagram
#### Agent
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#agent)
An agent combines AI's ability to make judgements and call the relevant tools to execute the task. An agent's output will be nondeterministic given:
 * Real-time availability and pricing changes
 * Dynamic prioritization of constraints
 * Ability to recover from failures
 * Adaptive decision-making based on intermediate results

!An agent diagram
An agents can dynamically generate an itinerary and execute on booking reservations, similarly to what you would expect from a travel agent.
### Three primary components of agent systems:
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#three-primary-components-of-agent-systems)
 * **Decision Engine** : Usually an LLM (Large Language Model) that determines action steps
 * **Tool Integration** : APIs, functions, and services the agent can utilize
 * **Memory System** : Maintains context and tracks task progress

#### How agents work
[](https://developers.cloudflare.com/agents/concepts/what-are-agents/#how-agents-work)
Agents operate in a continuous loop of:
 1. **Observing** the current state or task
 2. **Planning** what actions to take, using AI for reasoning
 3. **Executing** those actions using available tools (often APIs or MCPs ↗)
 4. **Learning** from the results (storing results in memory, updating task progress, and preparing for next iteration)

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/concepts/what-are-agents.mdx)
Last updated: Aug 15, 2025
 Previous 
Prompt an AI model ↗ Next 
Workflows 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Workflows · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/concepts/workflows

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.842890

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * What are workflows? 
 * Understanding workflows in agent systems 
 * Core components of a workflow 

## On this page
 * Overview 
 * What are workflows? 
 * Understanding workflows in agent systems 
 * Core components of a workflow 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Concepts 
 5. Workflows 

Copy page
# Workflows
## What are workflows?
[](https://developers.cloudflare.com/agents/concepts/workflows/#what-are-workflows)
A workflow is the orchestration layer that coordinates how an agent's components work together. It defines the structured paths through which tasks are processed, tools are called, and results are managed. While agents make dynamic decisions about what to do, workflows provide the underlying framework that governs how those decisions are executed.
### Understanding workflows in agent systems
[](https://developers.cloudflare.com/agents/concepts/workflows/#understanding-workflows-in-agent-systems)
Think of a workflow like the operating procedures of a company. The company (agent) can make various decisions, but how those decisions get implemented follows established processes (workflows). For example, when you book a flight through a travel agent, they might make different decisions about which flights to recommend, but the process of actually booking the flight follows a fixed sequence of steps.
Let's examine a basic agent workflow:
### Core components of a workflow
[](https://developers.cloudflare.com/agents/concepts/workflows/#core-components-of-a-workflow)
A workflow typically consists of several key elements:
 1. **Input Processing** The workflow defines how inputs are received and validated before being processed by the agent. This includes standardizing formats, checking permissions, and ensuring all required information is present.
 2. **Tool Integration** Workflows manage how external tools and services are accessed. They handle authentication, rate limiting, error recovery, and ensuring tools are used in the correct sequence.
 3. **State Management** The workflow maintains the state of ongoing processes, tracking progress through multiple steps and ensuring consistency across operations.
 4. **Output Handling** Results from the agent's actions are processed according to defined rules, whether that means storing data, triggering notifications, or formatting responses.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/concepts/workflows.mdx)
Last updated: Feb 25, 2025
 Previous 
Agents Next 
Tools 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# McpAgent — API Reference · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.843156

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * State synchronization APIs 
 * Not yet supported APIs 

## On this page
 * Overview 
 * State synchronization APIs 
 * Not yet supported APIs 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Model Context Protocol (MCP) 
 5. McpAgent — API Reference 

Copy page
# McpAgent — API Reference
When you build MCP Servers on Cloudflare, you extend the `McpAgent` class ↗, from the Agents SDK, like this:
 * 
 * 

JavaScript```


import {McpAgent} from "agents/mcp";




import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";




import {z} from "zod";




exportclassMyMCPextendsMcpAgent{




server =newMcpServer({ name:"Demo", version:"1.0.0"});




asyncinit(){




this.server.tool(




"add",




{ a:z.number(), b:z.number() },




async({a,b})=> ({




content: [{ type:"text", text:String(a+b) }],




}),




);



}


}

```

TypeScript```


import {McpAgent} from "agents/mcp";




import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";




import {z} from "zod";




exportclassMyMCPextendsMcpAgent{




server =newMcpServer({ name:"Demo", version:"1.0.0"});




asyncinit(){




this.server.tool(




"add",




{ a:z.number(), b:z.number() },




async({a,b})=> ({




content: [{ type:"text", text:String(a+b) }],




}),




);



}


}

```

This means that each instance of your MCP server has its own durable state, backed by a Durable Object, with its own SQL database.
Your MCP server doesn't necessarily have to be an Agent. You can build MCP servers that are stateless, and just add tools to your MCP server using the `@modelcontextprotocol/typescript-sdk` package.
But if you want your MCP server to:
 * remember previous tool calls, and responses it provided
 * provide a game to the MCP client, remembering the state of the game board, previous moves, and the score
 * cache the state of a previous external API call, so that subsequent tool calls can reuse it
 * do anything that an Agent can do, but allow MCP clients to communicate with it

You can use the APIs below in order to do so.
#### Hibernation Support
[](https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api/#hibernation-support)
`McpAgent` instances automatically support WebSockets Hibernation, allowing stateful MCP servers to sleep during inactive periods while preserving their state. This means your agents only consume compute resources when actively processing requests, optimizing costs while maintaining the full context and conversation history.
Hibernation is enabled by default and requires no additional configuration.
#### Authentication & Authorization
[](https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api/#authentication--authorization)
The McpAgent class provides seamless integration with the OAuth Provider Library ↗ for authentication and authorization.
When a user authenticates to your MCP server, their identity information and tokens are made available through the `props` parameter, allowing you to:
 * access user-specific data
 * check user permissions before performing operations
 * customize responses based on user attributes
 * use authentication tokens to make requests to external services on behalf of the user

### State synchronization APIs
[](https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api/#state-synchronization-apis)
The `McpAgent` class makes the following subset of methods from the Agents SDK available:
 * `state`
 * `initialState`
 * `setState`
 * `onStateUpdate`
 * `sql`

Currently, each client session is backed by an instance of the `McpAgent` class. This is handled automatically for you, as shown in the getting started guide. This means that when the same client reconnects, they will start a new session, and the state will be reset.
For example, the following code implements an MCP server that remembers a counter value, and updates the counter when the `add` tool is called:
 * 
 * 

JavaScript```


import {McpAgent} from "agents/mcp";




import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";




import {z} from "zod";




exportclassMyMCPextendsMcpAgent{




server =newMcpServer({




name:"Demo",




version:"1.0.0",




});




initialState ={




counter:1,



};



asyncinit(){




this.server.resource(`counter`,`mcp://resource/counter`,(uri)=>{




return{




contents: [{ uri:uri.href, text:String(this.state.counter) }],



};



});




this.server.tool(




"add",




"Add to the counter, stored in the MCP",




{ a:z.number() },




async({a})=>{




this.setState({...this.state, counter:this.state.counter+a});




return{




content: [



{



type:"text",




text:String(`Added ${a}, total is now ${this.state.counter}`),



},



],



};


},



);



}



onStateUpdate(state){




console.log({ stateUpdate:state});



}


}

```

TypeScript```


import {McpAgent} from "agents/mcp";




import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";




import {z} from "zod";




typeState={ counter:number};




exportclassMyMCPextendsMcpAgent<Env,State,{}>{




server =newMcpServer({




name:"Demo",




version:"1.0.0",




});




initialState:State={




counter:1,



};



asyncinit(){




this.server.resource(`counter`,`mcp://resource/counter`,(uri)=>{




return{




contents: [{ uri:uri.href, text:String(this.state.counter) }],



};



});




this.server.tool(




"add",




"Add to the counter, stored in the MCP",




{ a:z.number() },




async({a})=>{




this.setState({...this.state, counter:this.state.counter+a});




return{




content: [



{



type:"text",




text:String(`Added ${a}, total is now ${this.state.counter}`),



},



],



};


},



);



}



onStateUpdate(state:State){




console.log({ stateUpdate:state});



}


}

```

### Not yet supported APIs
[](https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api/#not-yet-supported-apis)
The following APIs from the Agents SDK are not yet available on `McpAgent`:
 * WebSocket APIs (`onMessage`, `onError`, `onClose`, `onConnect`)
 * Scheduling APIs `this.schedule`

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/model-context-protocol/mcp-agent-api.mdx)
Last updated: Aug 15, 2025
 Previous 
Transport Next 
Cloudflare's own MCP servers 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# MCP server portals · Cloudflare Zero Trust docs

## URL
https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.843987

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Cloudflare Zero Trust** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Get started 
 * Implementation guides
 * Overview 
 * Secure your Internet traffic and SaaS apps ↗ 
 * Replace your VPN ↗ 
 * Deploy clientless access ↗ 
 * Secure Microsoft 365 email with Email Security ↗ 
 * Holistic AI security with Cloudflare One ↗ 
 * Identity
 * Overview 
 * One-time PIN login 
 * Device posture
 * Overview 
 * WARP client checks
 * Overview 
 * Application check 
 * Carbon Black 
 * Client certificate 
 * Device serial numbers 
 * Device UUID 
 * Disk encryption 
 * Domain joined 
 * File check 
 * Firewall 
 * OS version 
 * Require Gateway 
 * Require WARP 
 * SentinelOne 
 * Service providers
 * Overview 
 * Custom integration 
 * CrowdStrike 
 * Kolide 
 * Microsoft Endpoint Manager 
 * SentinelOne 
 * Tanium 
 * Uptycs 
 * Workspace ONE 
 * Access integrations
 * Overview 
 * Mutual TLS 
 * Tanium (legacy) 
 * User management
 * Overview 
 * Session management 
 * Seat management 
 * SCIM provisioning 
 * Service tokens 
 * Authorization cookie
 * Overview 
 * Validate JWTs 
 * Application token 
 * CORS 
 * SSO integration
 * Overview 
 * Generic OIDC 
 * Generic SAML 2.0 
 * Active Directory (SAML) 
 * Amazon Cognito 
 * AWS IAM (SAML) 
 * Centrify 
 * Centrify (SAML) 
 * Citrix ADC (SAML) 
 * Facebook 
 * GitHub 
 * Google 
 * Google Workspace 
 * JumpCloud (SAML) 
 * Keycloak (SAML) 
 * LinkedIn 
 * Microsoft Entra ID 
 * Okta 
 * Okta (SAML) 
 * OneLogin 
 * OneLogin (SAML) 
 * PingFederate 
 * PingOne 
 * PingOne (SAML) 
 * Signed AuthN requests (SAML) 
 * Yandex 
 * Connections
 * Overview 
 * Cloudflare Tunnel
 * Overview 
 * Get started
 * Overview 
 * Create a tunnel (dashboard) 
 * Create a tunnel (API) 
 * Useful terms 
 * Downloads
 * Overview 
 * Update cloudflared 
 * License 
 * Copyrights 
 * Configure a tunnel
 * Configure cloudflared parameters
 * Overview 
 * Tunnel run parameters 
 * Origin configuration parameters 
 * Tunnel with firewall 
 * Tunnel availability and failover
 * Overview 
 * System requirements 
 * Tunnel permissions 
 * Use cases
 * Overview 
 * SSH
 * Overview 
 * SSH with Access for Infrastructure 
 * Self-managed SSH keys 
 * Browser-rendered SSH terminal 
 * SSH with client-side cloudflared (legacy) 
 * RDP
 * Overview 
 * Browser-based RDP 
 * RDP with WARP client 
 * RDP with client-side cloudflared 
 * SMB 
 * gRPC 
 * Environments
 * Overview 
 * Ansible 
 * AWS 
 * Azure 
 * GCP 
 * Kubernetes 
 * Terraform 
 * Private networks
 * Overview 
 * Connect with cloudflared
 * Overview 
 * Connect a private hostname Beta 
 * Connect an IP/CIDR 
 * Private DNS 
 * Virtual networks 
 * Load balancing 
 * Peer-to-peer connectivity 
 * WARP Connector
 * Overview Beta 
 * Site-to-Internet 
 * Site-to-site 
 * User-to-site 
 * Tips and best practices 
 * Published applications
 * Overview 
 * DNS records 
 * Load balancing 
 * Protocols 
 * Monitor tunnels
 * Overview 
 * Log streams 
 * Notifications 
 * Metrics 
 * Troubleshoot tunnels
 * Overview 
 * Diagnostic logs 
 * Private network connectivity 
 * Common errors 
 * Do more with Tunnel
 * Overview 
 * Locally-managed tunnels
 * Overview 
 * Create a locally-managed tunnel 
 * Configuration file 
 * Run as a service
 * Overview 
 * Linux 
 * macOS 
 * Windows 
 * Useful commands 
 * Tunnel permissions 
 * Useful terms 
 * Migrate legacy tunnels 
 * Quick Tunnels 
 * Connect devices
 * Overview 
 * WARP
 * Overview 
 * Download WARP
 * Stable releases 
 * Beta releases 
 * Update WARP 
 * Migrate 1.1.1.1 app 
 * First-time setup 
 * Deploy WARP
 * Overview 
 * Managed deployment
 * Overview 
 * Partners
 * Overview 
 * Fleet 
 * Hexnode 
 * Intune 
 * Jamf 
 * JumpCloud 
 * Kandji 
 * Parameters 
 * Connect WARP before Windows login 
 * Multiple users on a Windows device 
 * Switch between Zero Trust organizations 
 * Automated WARP registration 
 * Manual deployment 
 * Device enrollment permissions 
 * WARP with firewall 
 * WARP with legacy VPN 
 * Configure WARP
 * Overview 
 * Device profiles 
 * WARP modes
 * Overview 
 * Enable Device Information Only 
 * WARP settings
 * Overview 
 * Captive portal detection 
 * Managed networks 
 * Route traffic
 * Overview 
 * Local Domain Fallback 
 * Split Tunnels 
 * WARP architecture 
 * WARP sessions 
 * Troubleshoot WARP
 * Overview 
 * WARP troubleshooting guide 
 * Common issues 
 * Client errors 
 * Diagnostic logs 
 * Known limitations 
 * Connectivity status 
 * Remove WARP 
 * Agentless options
 * Overview 
 * DNS
 * Locations
 * Add locations 
 * DNS resolver IPs and hostnames 
 * DNS over TLS (DoT) 
 * DNS over HTTPS (DoH) 
 * PAC files 
 * User-side certificates
 * Overview 
 * Install certificate using WARP 
 * Install certificate manually 
 * Deploy custom certificate 
 * Applications
 * Overview 
 * Add web applications
 * Overview 
 * SaaS applications
 * Overview 
 * Generic OIDC application 
 * Generic SAML application 
 * Adobe Acrobat Sign 
 * Area 1 
 * Asana 
 * Atlassian Cloud 
 * AWS 
 * Braintree 
 * Coupa 
 * Digicert 
 * DocuSign 
 * Dropbox 
 * GitHub Enterprise Cloud 
 * Google Cloud 
 * Google Workspace 
 * Grafana 
 * Grafana Cloud 
 * Greenhouse Recruiting 
 * Hubspot 
 * Ironclad 
 * Jamf Pro 
 * Miro 
 * PagerDuty 
 * Pingboard 
 * Salesforce (OIDC) 
 * Salesforce (SAML) 
 * ServiceNow (OIDC) 
 * ServiceNow (SAML) 
 * Slack 
 * Smartsheet 
 * SparkPost 
 * Tableau Cloud 
 * Workday 
 * Zendesk 
 * Zoom 
 * Self-hosted public application 
 * MCP servers
 * MCP server portals Beta 
 * Secure MCP servers with Access for SaaS 
 * Enable MCP OAuth to self-hosted apps 
 * Non-HTTP applications
 * Overview 
 * Add an infrastructure application 
 * Add a self-hosted private application 
 * Browser-rendered terminal 
 * Client-side cloudflared
 * Overview 
 * Enable automatic cloudflared authentication 
 * Arbitrary TCP 
 * Private network applications (legacy) 
 * Short-lived certificates (legacy) 
 * Cloud Access Security Broker
 * Overview 
 * Manage findings 
 * Available integrations
 * Overview 
 * Amazon Web Services (AWS) S3 
 * Anthropic 
 * Atlassian Confluence 
 * Atlassian Jira 
 * Bitbucket Cloud 
 * Box 
 * Dropbox 
 * GitHub 
 * Google Cloud Platform (GCP) Cloud Storage 
 * Google Workspace
 * Overview 
 * Gmail 
 * Google Admin 
 * Google Calendar 
 * Google Drive 
 * Gmail (FedRAMP) 
 * Google Admin (FedRAMP) 
 * Google Calendar (FedRAMP) 
 * Google Drive (FedRAMP) 
 * Gemini for Google Workspace 
 * Microsoft 365
 * Overview 
 * Admin Center 
 * OneDrive 
 * Outlook 
 * SharePoint 
 * Admin Center (FedRAMP) 
 * OneDrive (FedRAMP) 
 * Outlook (FedRAMP) 
 * SharePoint (FedRAMP) 
 * OpenAI 
 * Salesforce 
 * Salesforce (FedRAMP) 
 * ServiceNow 
 * ServiceNow (FedRAMP) 
 * Slack 
 * Scan for sensitive data 
 * Troubleshooting
 * Troubleshoot integrations 
 * Troubleshoot compute accounts 
 * Application Library 
 * Login page 
 * Block page 
 * Add bookmarks 
 * App Launcher 
 * Policies
 * Overview 
 * Secure Web Gateway
 * Overview 
 * Get started
 * DNS filtering 
 * Network filtering 
 * HTTP filtering 
 * DNS policies
 * Overview 
 * Common policies 
 * Test DNS filtering 
 * Timed DNS policies 
 * Network policies
 * Overview 
 * Common policies 
 * Protocol detection 
 * SSH proxy and command logs (legacy) 
 * HTTP policies
 * Overview 
 * Common policies 
 * TLS decryption 
 * HTTP/3 inspection 
 * Application Granular Controls 
 * AV scanning 
 * File sandboxing 
 * Tenant control 
 * Egress policies
 * Overview 
 * Dedicated egress IPs 
 * Egress through Cloudflare Tunnel Beta 
 * Host selectors 
 * Resolver policies Beta 
 * Identity-based policies 
 * Global policies 
 * Applications and app types 
 * Domain categories 
 * Order of enforcement 
 * Proxy 
 * Lists 
 * Block page 
 * Managed service providers (MSPs) 
 * Access
 * Overview 
 * Manage Access policies 
 * Rule groups 
 * Require purpose justification 
 * External Evaluation rules 
 * Isolate self-hosted application 
 * Application paths 
 * Enforce MFA 
 * Temporary authentication 
 * Browser Isolation
 * Overview 
 * Set up Browser Isolation
 * Get started 
 * Clientless Web Isolation 
 * Non-identity on-ramps 
 * Isolation policies 
 * Extensions 
 * Accessibility 
 * Browser Isolation with firewall 
 * Known limitations 
 * Data Loss Prevention
 * Overview 
 * Scan HTTP traffic
 * Create DLP policies 
 * Common policies 
 * Logging options 
 * Scan SaaS apps ↗ 
 * DLP profiles
 * Configure DLP profiles 
 * Predefined profiles 
 * Integration profiles 
 * Profile settings 
 * Detection entries 
 * Insights
 * Analytics
 * Analytics overview 
 * Access event analytics 
 * Gateway analytics 
 * Shadow IT SaaS analytics 
 * AI prompt logs ↗ 
 * DEX
 * Overview 
 * Monitoring 
 * Tests
 * Overview 
 * HTTP test 
 * Traceroute test 
 * View test results 
 * Rules 
 * Remote captures 
 * Notifications 
 * IP visibility 
 * DEX MCP server 
 * MCP server ↗ MCP 
 * Logs
 * Overview 
 * User logs 
 * Access audit logs 
 * Gateway activity logs
 * Overview 
 * Manage PII 
 * SCIM logs 
 * Tunnel audit logs 
 * Posture logs 
 * Logpush integration 
 * Enable Email Security logs 
 * Risk score 
 * Email Security
 * Overview 
 * Retro Scan 
 * Setup
 * Before you begin 
 * Post-delivery deployment
 * API deployment
 * Overview 
 * Set up with Microsoft 365 
 * BCC/Journaling
 * BCC setup
 * Gmail BCC setup
 * Overview 
 * Enable Gmail BCC integration 
 * Connect your domains 
 * Add BCC rules 
 * Enable auto-moves 
 * Microsoft Exchange BCC setup 
 * Journaling setup
 * Microsoft 365 journaling setup 
 * Manually add domains 
 * Pre-delivery deployment
 * Prerequisites
 * Microsoft 365 as MX Record
 * Overview 
 * Use cases
 * 1 - Junk email and Email Security Admin Quarantine 
 * 2 - Junk email and user managed quarantine 
 * 3 - Junk email and administrative quarantine 
 * 4 - User managed quarantine and administrative quarantine 
 * 5 - Junk email folder and administrative quarantine 
 * Google Workspace as MX Record 
 * Cisco - Email Security as MX Record 
 * Cisco - Cisco as MX Record 
 * MX/Inline deployment 
 * Set up MX/Inline deployment 
 * Egress IPs 
 * Partner domain TLS 
 * Manage domains 
 * Email monitoring
 * Overview 
 * Search email 
 * Download a report 
 * Directories
 * Overview 
 * Manage integrated directories
 * Manage groups in your directory 
 * Manage users in your directory 
 * Manage Email Security directories 
 * Detection settings
 * Allow policies 
 * Blocked senders 
 * Trusted domains 
 * Impersonation registry 
 * Additional detections 
 * Configure link actions 
 * Configure text add-ons 
 * Auto-move events 
 * Phish submissions 
 * Outbound Data Loss Prevention (DLP) 
 * PhishGuard 
 * Reference
 * How Email Security detects phish 
 * Information about your domain 
 * Dispositions and attributes 
 * Email Security API ↗ API 
 * API and Terraform
 * Overview 
 * Access API examples
 * Overview 
 * Any valid service token 
 * Authentication method 
 * Common name 
 * Country Code 
 * Email 
 * Email domain 
 * Everyone 
 * G Suite Group 
 * GitHub™ Organization 
 * IP range 
 * Microsoft Entra Group 
 * mTLS certificate 
 * Okta Group 
 * Rule group 
 * SAML Attribute 
 * Service token 
 * Terraform 
 * Reference architecture ↗ 
 * Tutorials 
 * Videos 
 * Account limits 
 * Roles and permissions 
 * Glossary 
 * Changelog
 * Overview 
 * Access 
 * Browser Isolation 
 * CASB 
 * Cloudflare Tunnel 
 * Data Loss Prevention 
 * Digital Experience Monitoring 
 * Email Security 
 * Gateway 
 * Risk score 
 * Zero Trust WARP Client 
 * FAQ 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Prerequisites 
 * Add an MCP server 
 * Server status 
 * Reauthenticate the MCP server 
 * Synchronize the MCP server 
 * Create a portal 
 * Customize login settings 
 * Connect to a portal 
 * View portal logs 
 * Log fields 

## On this page
 * Overview 
 * Prerequisites 
 * Add an MCP server 
 * Server status 
 * Reauthenticate the MCP server 
 * Synchronize the MCP server 
 * Create a portal 
 * Customize login settings 
 * Connect to a portal 
 * View portal logs 
 * Log fields 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Cloudflare Zero Trust 
 4. Applications 
 5. Add web applications 
 6. MCP servers 
 7. MCP server portals 

Copy page
# MCP server portals
An MCP server portal centralizes multiple Model Context Protocol (MCP) servers ↗ onto a single HTTP endpoint. Key benefits include:
 * **Streamlined access to multiple MCP servers** : MCP server portals support both unauthenticated MCP servers (such as the Cloudflare Documentation MCP server ↗) as well as MCP servers secured using any third-party or custom OAuth provider. Users log in to the portal URL through Cloudflare Access and are prompted to authenticate separately to each server that requires OAuth.
 * **Customized tools per portal** : Admins can tailor an MCP portal to a particular use case by choosing the specific tools and prompt templates that they want to make available to users through the portal. This allows users to access a curated set of tools and prompts — the less external context exposed to the AI model, the better the AI responses tend to be.
 * **Observability** : Once the user's AI agent is connected to the portal, Cloudflare Access logs the individual requests made using the tools in the portal.

## Prerequisites
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#prerequisites)
 * An active domain on Cloudflare
 * Domain uses either a full setup or a partial (`CNAME`) setup
 * An identity provider configured on Cloudflare Zero Trust

## Add an MCP server
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#add-an-mcp-server)
Add individual MCP servers to Cloudflare Access to bring them under centralized management.
To add an MCP server:
 1. In Zero Trust ↗, go to **Access** > **Applications** > **AI controls**.
 2. Select the **MCP servers** tab.
 3. Select **Add an MCP server**.
 4. Enter any name for the server.
 5. (Optional) Enter a custom string for the **Server ID**.
 6. In **HTTP URL** , enter the full URL of your MCP server. For example, if you want to add the Cloudflare Documentation MCP server ↗, enter `https://docs.mcp.cloudflare.com/sse`.
 7. Add Access policies to show or hide the server in an MCP server portal. The MCP server link will only appear in the portal for users who match an Allow policy. Users who do not pass an Allow policy will not see this server through any portals.
Blocked users can still connect to the server (and bypass your Access policies) by using its direct URL. If you want to enforce authentication through Cloudflare Access, configure Access as the server's OAuth provider.
 8. Select **Save and connect server**.
 9. If the MCP server supports OAuth, you will be redirected to log in to your OAuth provider. You can log in to any account on the MCP server. The account used to authenticate will serve as the admin credential for that MCP server. You can configure an MCP portal to use this admin credential to make requests.

Cloudflare Access will validate the server connection and fetch a list of tools and prompts. Once the server is successfully connected, the server status will change to **Ready**. You can now add the MCP server to an MCP server portal.
### Server status
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#server-status)
The MCP server status indicates the synchronization status of the MCP server to Cloudflare Access.
Status | Description 
---|--- 
Error | The server's authentication failed due to expired or incorrect credentials. To fix the issue, reauthenticate the server. 
Waiting | The server's tools, prompts, and resources are being synchronized. 
Ready | The server was successfully synchronized and all tools, prompts, and resources are available. 
### Reauthenticate the MCP server
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#reauthenticate-the-mcp-server)
To reauthenticate an MCP server in Cloudflare Access:
 1. In Zero Trust ↗, go to **Access** > **Applications** > **AI controls**.
 2. Select the **MCP servers** tab.
 3. Select the server that you want to reauthenticate, then select **Edit**.
 4. Select **Authenticate server**.

You will be redirected to log in to your OAuth provider. The account used to authenticate will serve as the new admin credential for this MCP server.
### Synchronize the MCP server
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#synchronize-the-mcp-server)
Cloudflare Access automatically synchronizes with your MCP server every 24 hours. To manually refresh the MCP server in Zero Trust:
 1. In Zero Trust ↗, go to **Access** > **Applications** > **AI controls**.
 2. Select the **MCP servers** tab and find the server that you want to refresh.
 3. Select the three dots > **Sync capabilities**.

The MCP server page will show the updated list of tools and prompts. New tools and prompts are automatically enabled in the MCP server portal.
## Create a portal
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#create-a-portal)
To create an MCP server portal:
 1. In Zero Trust ↗, go to **Access** > **Applications** > **AI controls**.
 2. Select **Add an MCP server portal**.
 3. Enter any name for the portal.
 4. Under **Custom domain** , select a domain for the portal URL. Domains must belong to an active zone in your Cloudflare account. You can optionally specify a subdomain.
 5. Add MCP servers to the portal.
 6. (Optional) Under **MCP servers** , configure the tools and prompts available through the portal.
 7. (Optional) Configure **Require user auth** for servers that support OAuth:
 * `Enabled`: (default) User will be prompted to utilize their own login credentials to establish a connection with the MCP server.
 * `Disabled`: Users who are connected to the portal will automatically have access to the MCP server via its admin credential.
 8. Add Access policies to define the users who can connect to the portal URL.
 9. Select **Add an MCP server portal**.
 10. (Optional) Customize the login experience for the portal.

Users can now connect to the portal at `https://<subdomain>.<domain>/mcp` using an MCP client.
### Customize login settings
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#customize-login-settings)
Cloudflare Access automatically creates an Access application for each MCP server portal. You can customize the portal login experience by updating Access application settings:
 1. In Zero Trust ↗, go to **Access** > **Applications**.
 2. Find the portal that you want to configure, then select the three dots > **Edit**.
 3. To configure identity providers for the portal: 
 1. Select the **Login methods** tab.
 2. Select the identity providers that you want to enable for your application.
 3. (Recommended) If you plan to only allow access via a single identity provider, turn on **Instant Auth**. End users will not be shown the Cloudflare Access login page. Instead, Cloudflare will redirect users directly to your SSO login event.
 4. To customize the block page: 
 1. Select the **Experience settings** tab.
 2. Under **Block page** , choose what end users will see when they are denied access to the application:
 * **Cloudflare default** : Reload the login page and display a block message below the Cloudflare Access logo. The default message is `That account does not have access`, or you can enter a custom message.
 * **Redirect URL** : Redirect to the specified website.
 * **Custom page template** : Display a custom block page hosted in Zero Trust.
 5. Select **Save application**.

## Connect to a portal
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#connect-to-a-portal)
Users can connect to your MCP server running at `https://<subdomain>.<domain>/mcp` using Workers AI Playground ↗, MCP inspector ↗, or other MCP clients that support remote MCP servers.
To test in Workers AI Playground:
 1. Go to Workers AI Playground ↗.
 2. Under **MCP Servers** , enter `https://<subdomain>.<domain>/mcp` for the portal URL.
 3. Select **Connect**.
 4. In the popup window, log in to your Cloudflare Access identity provider.
 5. The popup window will list the MCP servers in the portal that require authentication. For each of these MCP servers, select **Connect** and follow the login prompts.
 6. Select **Done** to complete the portal authentication process.

Workers AI Playground will show a **Connected** status and list the available tools. You can now ask the AI model to complete a task using an available tool. Requests made to an MCP server will appear in your portal logs.
## View portal logs
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#view-portal-logs)
Portal logs allow you to monitor user activity through an MCP server portal. You can view logs on a per-portal or per-server basis.
 1. In Zero Trust ↗, go to **Access** > **Applications** > **AI controls**.
 2. Find the portal or server that you want to view logs for, then select the three dots > **Edit**.
 3. Select **Logs**.

### Log fields
[](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals/#log-fields)
Field | Description 
---|--- 
Time | Date and time of the request 
Status | Whether the server successfully returned a response 
Server | Name of the MCP server that handled the request 
Capability | The tool used to process the request 
Duration | Processing time for the request in milliseconds 
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/cloudflare-one/applications/configure-apps/mcp-servers/mcp-portals.mdx)
Last updated: Sep 2, 2025
 Previous 
Self-hosted public application Next 
Secure MCP servers with Access for SaaS 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Test a Remote MCP Server · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/guides/test-remote-mcp-server

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.844224

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * The Model Context Protocol (MCP) inspector 
 * Connect your remote MCP server to Claude Desktop via a local proxy 
 * Connect your remote MCP server to Cursor 
 * Connect your remote MCP server to Windsurf 

## On this page
 * Overview 
 * The Model Context Protocol (MCP) inspector 
 * Connect your remote MCP server to Claude Desktop via a local proxy 
 * Connect your remote MCP server to Cursor 
 * Connect your remote MCP server to Windsurf 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Guides 
 5. Test a Remote MCP Server 

Copy page
# Test a Remote MCP Server
Remote, authorized connections are an evolving part of the Model Context Protocol (MCP) specification ↗. Not all MCP clients support remote connections yet.
This guide will show you options for how to start using your remote MCP server with MCP clients that support remote connections. If you haven't yet created and deployed a remote MCP server, you should follow the Build a Remote MCP Server guide first.
## The Model Context Protocol (MCP) inspector
[](https://developers.cloudflare.com/agents/guides/test-remote-mcp-server/#the-model-context-protocol-mcp-inspector)
The `@modelcontextprotocol/inspector` package ↗ is a visual testing tool for MCP servers.
You can run it locally by running the following command:
Terminal window```


npx@modelcontextprotocol/inspector


```

Then, enter the URL of your remote MCP server. You can use an MCP server running on your local machine on localhost, or you can use a remote MCP server running on Cloudflare.
!MCP inspector
Once you have authenticated, you will be redirected back to the inspector. You should see the "List Tools" button, which will list the tools that your MCP server exposes.
!MCP inspector — authenticated
## Connect your remote MCP server to Claude Desktop via a local proxy
[](https://developers.cloudflare.com/agents/guides/test-remote-mcp-server/#connect-your-remote-mcp-server-to-claude-desktop-via-a-local-proxy)
Even though Claude Desktop ↗ doesn't yet support remote MCP clients, you can use the `mcp-remote` local proxy ↗ to connect it to your remote MCP server. This lets you to test what an interaction with your remote MCP server will be like with a real-world MCP client.
 1. Open Claude Desktop and navigate to Settings -> Developer -> Edit Config. This opens the configuration file that controls which MCP servers Claude can access.
 2. Replace the content with a configuration like this:

```

{



"mcpServers":{




"math":{




"command":"npx",




"args":["mcp-remote","http://my-mcp-server.my-account.workers.dev/sse"]



}


}


}

```

This tells Claude to communicate with your MCP server running at `http://localhost:8788/sse`.
 1. Save the file and restart Claude Desktop (command/ctrl + R). When Claude restarts, a browser window will open showing your OAuth login page. Complete the authorization flow to grant Claude access to your MCP server.

Once authenticated, you'll be able to see your tools by clicking the tools icon in the bottom right corner of Claude's interface.
## Connect your remote MCP server to Cursor
[](https://developers.cloudflare.com/agents/guides/test-remote-mcp-server/#connect-your-remote-mcp-server-to-cursor)
To connect Cursor ↗ with your remote MCP server, choose `Type`: "Command" and in the `Command` field, combine the command and args fields into one (e.g.`npx mcp-remote https://your-worker-name.your-account.workers.dev/sse`).
## Connect your remote MCP server to Windsurf
[](https://developers.cloudflare.com/agents/guides/test-remote-mcp-server/#connect-your-remote-mcp-server-to-windsurf)
You can connect your remote MCP server to Windsurf ↗ by editing the `mcp_config.json` file ↗, and adding the following configuration:
```

{



"mcpServers":{




"math":{




"command":"npx",




"args":["mcp-remote","http://my-mcp-server.my-account.workers.dev/sse"]



}


}


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/guides/test-remote-mcp-server.mdx)
Last updated: Aug 20, 2025
 Previous 
Build a Remote MCP server Next 
Build a Remote MCP Client ↗ 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Limits · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/platform/limits

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.844349

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 

## On this page
 * Overview 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Platform 
 5. Limits 

Copy page
# Limits
Limits that apply to authoring, deploying, and running Agents are detailed below.
Many limits are inherited from those applied to Workers scripts and/or Durable Objects, and are detailed in the Workers limits documentation.
Feature | Limit 
---|--- 
Max concurrent (running) Agents per account | Tens of millions+ 1 
Max definitions per account | ~250,000+ 2 
Max state stored per unique Agent | 1 GB 
Max compute time per Agent | 30 seconds (refreshed per HTTP request / incoming WebSocket message) 3 
Duration (wall clock) per step 3 | Unlimited (for example, waiting on a database call or an LLM response) 
* * *
To request an adjustment to a limit, complete the Limit Increase Request Form ↗. If the limit can be increased, Cloudflare will contact you with next steps.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/platform/limits.mdx)
Last updated: Jul 30, 2025
 Previous 
x402 Next 
Prompt Engineering ↗ 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Build a Remote MCP server · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/guides/remote-mcp-server

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.844804

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Deploy your first MCP server 
 * Set up and deploy your MCP server via CLI 
 * Connect your Remote MCP server to Claude and other MCP Clients via a local proxy 
 * Add Authentication 
 * Step 1 — Create a new MCP server 
 * Step 2 — Create an OAuth App 
 * Next steps 

## On this page
 * Overview 
 * Deploy your first MCP server 
 * Set up and deploy your MCP server via CLI 
 * Connect your Remote MCP server to Claude and other MCP Clients via a local proxy 
 * Add Authentication 
 * Step 1 — Create a new MCP server 
 * Step 2 — Create an OAuth App 
 * Next steps 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Guides 
 5. Build a Remote MCP server 

Copy page
# Build a Remote MCP server
## Deploy your first MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-first-mcp-server)
This guide will show you how to deploy your own remote MCP server on Cloudflare, with two options:
 * **Without authentication** — anyone can connect and use the server (no login required).
 * **Withauthentication and authorization** — users sign in before accessing tools, and you can control which tools an agent can call based on the user's permissions.

You can start by deploying a public MCP server ↗ without authentication, then add user authentication and scoped authorization later. If you already know your server will require authentication, you can skip ahead to the next section.
The button below will guide you through everything you need to do to deploy this example MCP server ↗ to your Cloudflare account:

Once deployed, this server will be live at your workers.dev subdomain (e.g. remote-mcp-server-authless.your-account.workers.dev/sse). You can connect to it immediately using the AI Playground ↗ (a remote MCP client), MCP inspector ↗ or other MCP clients. Then, once you're ready, you can customize the MCP server and add your own tools.
If you're using the "Deploy to Cloudflare" button, a new git repository will be set up on your GitHub or GitLab account for your MCP server, configured to automatically deploy to Cloudflare each time you push a change or merge a pull request to the main branch of the repository. You can then clone this repository, develop locally, and start writing code and building.
### Set up and deploy your MCP server via CLI
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#set-up-and-deploy-your-mcp-server-via-cli)
Alternatively, you can use the command line as shown below to create a new MCP Server on your local machine.
 * 
 * 
 * 

Terminal window```


npmcreatecloudflare@latest--my-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Terminal window```


yarncreatecloudflaremy-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Terminal window```


pnpmcreatecloudflare@latestmy-mcp-server--template=cloudflare/ai/demos/remote-mcp-authless


```

Now, you have the MCP server setup, with dependencies installed. Move into that project folder:
Terminal window```


cdmy-mcp-server


```

#### Local development
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#local-development)
In the directory of your new project, run the following command to start the development server:
Terminal window```


npmstart


```

Your MCP server is now running on `http://localhost:8788/sse`.
In a new terminal, run the MCP inspector ↗. The MCP inspector is an interactive MCP client that allows you to connect to your MCP server and invoke tools from a web browser.
Terminal window```


npx@modelcontextprotocol/inspector@latest


```

Open the MCP inspector in your web browser:
Terminal window```


openhttp://localhost:5173


```

In the inspector, enter the URL of your MCP server, `http://localhost:8788/sse`, and click **Connect**. You should see the "List Tools" button, which will list the tools that your MCP server exposes.
!MCP inspector — authenticated
#### Deploy your MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-mcp-server)
You can deploy your MCP server to Cloudflare using the following Wrangler CLI command within the example project:
Terminal window```


npxwrangler@latestdeploy


```

If you have already connected a git repository to the Worker with your MCP server, you can deploy your MCP server by pushing a change or merging a pull request to the main branch of the repository.
After deploying, take the URL of your deployed MCP server, and enter it in the MCP inspector running on `http://localhost:5173`. You now have a remote MCP server, deployed to Cloudflare, that MCP clients can connect to.
### Connect your Remote MCP server to Claude and other MCP Clients via a local proxy
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#connect-your-remote-mcp-server-to-claude-and-other-mcp-clients-via-a-local-proxy)
Now that your MCP server is running, you can use the `mcp-remote` local proxy ↗ to connect Claude Desktop or other MCP clients to it — even though these tools aren't yet _remote_ MCP clients, and don't support remote transport or authorization on the client side. This lets you test what an interaction with your MCP server will be like with a real MCP client.
Update your Claude Desktop configuration to point to the URL of your MCP server. You can use either the `localhost:8787/sse` URL, or the URL of your deployed MCP server:
```

{



"mcpServers":{




"math":{




"command":"npx",




"args":[




"mcp-remote",



"https://your-worker-name.your-account.workers.dev/sse"


]


}


}


}

```

Restart Claude Desktop after updating your config file to load the MCP Server. Once this is done, Claude will be able to make calls to your remote MCP server. You can test this by asking Claude to use one of your tools. For example: "Could you use the math tool to add 23 and 19?". Claude should invoke the tool and show the result generated by the MCP server.
Learn more about other ways of using remote MCP servers with MCP clients here in this section.
## Add Authentication
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication)
Now that you’ve deployed a public MCP server, let’s walk through how to enable user authentication using OAuth.
The public server example you deployed earlier allows any client to connect and invoke tools without logging in. To add authentication, you’ll update your MCP server to act as an OAuth provider, handling secure login flows and issuing access tokens that MCP clients can use to make authenticated tool calls.
This is especially useful if users already need to log in to use your service. Once authentication is enabled, users can sign in with their existing account and grant their AI agent permission to interact with the tools exposed by your MCP server, using scoped permissions.
In this example, we use GitHub as an OAuth provider, but you can connect your MCP server with any OAuth provider that supports the OAuth 2.0 specification, including Google, Slack, Stytch, Auth0, WorkOS, and more.
### Step 1 — Create a new MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#step-1--create-a-new-mcp-server)
Run the following command to create a new MCP server:
 * 
 * 
 * 

Terminal window```


npmcreatecloudflare@latest--my-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Terminal window```


yarncreatecloudflaremy-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Terminal window```


pnpmcreatecloudflare@latestmy-mcp-server-github-auth--template=cloudflare/ai/demos/remote-mcp-github-oauth


```

Now, you have the MCP server setup, with dependencies installed. Move into that project folder:
Terminal window```


cdmy-mcp-server-github-auth


```

You'll notice that in the example MCP server, if you open `src/index.ts`, the primary difference is that the `defaultHandler` is set to the `GitHubHandler`:
TypeScript```


import GitHubHandler from "./github-handler";




exportdefaultnewOAuthProvider({




apiRoute:"/sse",




apiHandler:MyMCP.Router,




defaultHandler:GitHubHandler,




authorizeEndpoint:"/authorize",




tokenEndpoint:"/token",




clientRegistrationEndpoint:"/register",




});


```

This will ensure that your users are redirected to GitHub to authenticate. To get this working though, you need to create OAuth client apps in the steps below.
### Step 2 — Create an OAuth App
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#step-2--create-an-oauth-app)
You'll need to create two GitHub OAuth Apps ↗ to use GitHub as an authentication provider for your MCP server — one for local development, and one for production.
#### First create a new OAuth App for local development
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#first-create-a-new-oauth-app-for-local-development)
Navigate to github.com/settings/developers ↗ to create a new OAuth App with the following settings:
 * **Application name** : `My MCP Server (local)`
 * **Homepage URL** : `http://localhost:8788`
 * **Authorization callback URL** : `http://localhost:8788/callback`

For the OAuth app you just created, add the client ID of the OAuth app as `GITHUB_CLIENT_ID` and generate a client secret, adding it as `GITHUB_CLIENT_SECRET` to a `.dev.vars` file in the root of your project, which will be used to set secrets in local development.
Terminal window```


touch.dev.vars




echo'GITHUB_CLIENT_ID="your-client-id"'>>.dev.vars




echo'GITHUB_CLIENT_SECRET="your-client-secret"'>>.dev.vars




cat.dev.vars


```

#### Next, run your MCP server locally
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#next-run-your-mcp-server-locally)
Run the following command to start the development server:
Terminal window```


npmstart


```

Your MCP server is now running on `http://localhost:8788/sse`.
In a new terminal, run the MCP inspector ↗. The MCP inspector is an interactive MCP client that allows you to connect to your MCP server and invoke tools from a web browser.
Terminal window```


npx@modelcontextprotocol/inspector@latest


```

Open the MCP inspector in your web browser:
Terminal window```


openhttp://localhost:5173


```

In the inspector, set **Transport Type** to `SSE` and enter the URL of your MCP server, `http://localhost:8788/sse`
In the main panel on the right, click the **Open OAuth Settings** button and then click **Quick OAuth Flow**.
You should be redirected to a GitHub login or authorization page. After authorizing the MCP Client (the inspector) access to your GitHub account, you will be redirected back to the inspector.
Click **Connect** in the sidebar and you should see the "List Tools" button, which will list the tools that your MCP server exposes.
#### Second — create a new OAuth App for production
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#second-create-a-new-oauth-app-for-production)
You'll need to repeat these steps to create a new OAuth App for production.
Navigate to github.com/settings/developers ↗ to create a new OAuth App with the following settings:
 * **Application name** : `My MCP Server (production)`
 * **Homepage URL** : Enter the workers.dev URL of your deployed MCP server (ex: `worker-name.account-name.workers.dev`)
 * **Authorization callback URL** : Enter the `/callback` path of the workers.dev URL of your deployed MCP server (ex: `worker-name.account-name.workers.dev/callback`)

For the OAuth app you just created, add the client ID and client secret, using Wrangler CLI:
Terminal window```


wranglersecretputGITHUB_CLIENT_ID


```

Terminal window```


wranglersecretputGITHUB_CLIENT_SECRET


```

```

npx wrangler secret put COOKIE_ENCRYPTION_KEY # add any random string here e.g. openssl rand -hex 32

```

When you create the first secret, Wrangler will ask if you want to create a new Worker. Submit "Y" to create a new Worker and save the secret.
#### Set up a KV namespace
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#set-up-a-kv-namespace)
 * Create the KV namespace:

Terminal window```


npxwranglerkvnamespacecreate"OAUTH_KV"


```

 * Update the `wrangler.jsonc` file with the resulting KV ID:

```

{



"kvNamespaces":[



{



"binding":"OAUTH_KV",




"id":"<YOUR_KV_NAMESPACE_ID>"



}


]


}

```

#### Deploy your server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#deploy-your-server)
Deploy the MCP server to your Cloudflare `workers.dev` domain:
Terminal window```


npmrundeploy


```

#### Finally, connect to your MCP server
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#finally-connect-to-your-mcp-server)
Now that you've added the ID and secret of your production OAuth app, you should now be able to connect to your MCP server running at `worker-name.account-name.workers.dev/sse` using the AI Playground ↗, MCP inspector or (other MCP clients), and authenticate with GitHub.
## Next steps
[](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#next-steps)
 * Add tools to your MCP server.
 * Customize your MCP Server's authentication and authorization.

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/guides/remote-mcp-server.mdx)
Last updated: Oct 8, 2025
 Previous 
Implement Effective Agent Patterns ↗ Next 
Test a Remote MCP Server 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices



---

# Patterns · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/patterns

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.845066

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * Prompt Chaining 
 * Routing 
 * Parallelization 
 * Orchestrator-Workers 
 * Evaluator-Optimizer 

## On this page
 * Overview 
 * Prompt Chaining 
 * Routing 
 * Parallelization 
 * Orchestrator-Workers 
 * Evaluator-Optimizer 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Patterns 

Copy page
# Patterns
This page lists and defines common patterns for implementing AI agents, based on Anthropic's patterns for building effective agents ↗.
Code samples use the AI SDK ↗, running in Durable Objects.
## Prompt Chaining
[](https://developers.cloudflare.com/agents/patterns/#prompt-chaining)
Decomposes tasks into a sequence of steps, where each LLM call processes the output of the previous one.
!Figure 1: Prompt Chaining
TypeScript```


import {openai} from "@ai-sdk/openai";




import {generateText,generateObject} from "ai";




import {z} from "zod";




exportdefaultasyncfunctiongenerateMarketingCopy(input:string){




constmodel=openai("gpt-4o");



// First step: Generate marketing copy



const{text:copy}=awaitgenerateText({




model,




prompt:`Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`,




});



// Perform quality check on copy



const{object:qualityMetrics}=awaitgenerateObject({




model,




schema:z.object({




hasCallToAction:z.boolean(),




emotionalAppeal:z.number().min(1).max(10),




clarity:z.number().min(1).max(10),




}),




prompt:`Evaluate this marketing copy for:



1. Presence of call to action (true/false)


2. Emotional appeal (1-10)


3. Clarity (1-10)



Copy to evaluate: ${copy}`,




});



// If quality check fails, regenerate with more specific instructions



if (




!qualityMetrics.hasCallToAction||




qualityMetrics.emotionalAppeal<7||




qualityMetrics.clarity<7




) {




const{text:improvedCopy}=awaitgenerateText({




model,




prompt:`Rewrite this marketing copy with:




${!qualityMetrics.hasCallToAction?"- A clear call to action":""}




${qualityMetrics.emotionalAppeal<7?"- Stronger emotional appeal":""}




${qualityMetrics.clarity<7?"- Improved clarity and directness":""}




Original copy: ${copy}`,




});




return{ copy:improvedCopy,qualityMetrics};



}



return{copy,qualityMetrics};



}

```

## Routing
[](https://developers.cloudflare.com/agents/patterns/#routing)
Classifies input and directs it to specialized followup tasks, allowing for separation of concerns.
!Figure 2: Routing
TypeScript```


import {openai} from '@ai-sdk/openai';




import {generateObject,generateText} from 'ai';




import {z} from 'zod';




asyncfunctionhandleCustomerQuery(query:string){




constmodel=openai('gpt-4o');



// First step: Classify the query type



const{object:classification}=awaitgenerateObject({




model,




schema:z.object({




reasoning:z.string(),




type:z.enum(['general','refund','technical']),




complexity:z.enum(['simple','complex']),




}),




prompt:`Classify this customer query:




${query}



Determine:


1. Query type (general, refund, or technical)


2. Complexity (simple or complex)



3. Brief reasoning for classification`,




});



// Route based on classification


// Set model and system prompt based on query type and complexity



const{text:response}=awaitgenerateText({




model:




classification.complexity==='simple'




?openai('gpt-4o-mini')




:openai('o1-mini'),




system:{




general:




'You are an expert customer service agent handling general inquiries.',




refund:




'You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.',




technical:




'You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.',




}[classification.type],




prompt:query,




});




return{response,classification};



}

```

## Parallelization
[](https://developers.cloudflare.com/agents/patterns/#parallelization)
Enables simultaneous task processing through sectioning or voting mechanisms.
!Figure 3: Parallelization
TypeScript```


import {openai} from '@ai-sdk/openai';




import {generateText,generateObject} from 'ai';




import {z} from 'zod';



// Example: Parallel code review with multiple specialized reviewers



asyncfunctionparallelCodeReview(code:string){




constmodel=openai('gpt-4o');



// Run parallel reviews



const[securityReview,performanceReview,maintainabilityReview]=




awaitPromise.all([




generateObject({




model,




system:




'You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.',




schema:z.object({




vulnerabilities:z.array(z.string()),




riskLevel:z.enum(['low','medium','high']),




suggestions:z.array(z.string()),




}),




prompt:`Review this code:




${code}`,




}),




generateObject({




model,




system:




'You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.',




schema:z.object({




issues:z.array(z.string()),




impact:z.enum(['low','medium','high']),




optimizations:z.array(z.string()),




}),




prompt:`Review this code:




${code}`,




}),




generateObject({




model,




system:




'You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.',




schema:z.object({




concerns:z.array(z.string()),




qualityScore:z.number().min(1).max(10),




recommendations:z.array(z.string()),




}),




prompt:`Review this code:




${code}`,




}),




]);




constreviews= [




{...securityReview.object, type:'security'},




{...performanceReview.object, type:'performance'},




{...maintainabilityReview.object, type:'maintainability'},




];



// Aggregate results using another model instance



const{text:summary}=awaitgenerateText({




model,




system:'You are a technical lead summarizing multiple code reviews.',




prompt:`Synthesize these code review results into a concise summary with key actions:




${JSON.stringify(reviews,null,2)}`,




});




return{reviews,summary};



}

```

## Orchestrator-Workers
[](https://developers.cloudflare.com/agents/patterns/#orchestrator-workers)
A central LLM dynamically breaks down tasks, delegates to Worker LLMs, and synthesizes results.
!Figure 4: Orchestrator Workers
TypeScript```


import {openai} from '@ai-sdk/openai';




import {generateObject} from 'ai';




import {z} from 'zod';




asyncfunctionimplementFeature(featureRequest:string){



// Orchestrator: Plan the implementation



const{object:implementationPlan}=awaitgenerateObject({




model:openai('o1'),




schema:z.object({




files:z.array(




z.object({




purpose:z.string(),




filePath:z.string(),




changeType:z.enum(['create','modify','delete']),




}),




),




estimatedComplexity:z.enum(['low','medium','high']),




}),




system:




'You are a senior software architect planning feature implementations.',




prompt:`Analyze this feature request and create an implementation plan:




${featureRequest}`,




});



// Workers: Execute the planned changes



constfileChanges=awaitPromise.all(




implementationPlan.files.map(asyncfile=>{



// Each worker is specialized for the type of change



constworkerSystemPrompt={




create:




'You are an expert at implementing new files following best practices and project patterns.',




modify:




'You are an expert at modifying existing code while maintaining consistency and avoiding regressions.',




delete:




'You are an expert at safely removing code while ensuring no breaking changes.',




}[file.changeType];




const{object:change}=awaitgenerateObject({




model:openai('gpt-4o'),




schema:z.object({




explanation:z.string(),




code:z.string(),




}),




system:workerSystemPrompt,




prompt:`Implement the changes for ${file.filePath} to support:




${file.purpose}



Consider the overall feature context:



${featureRequest}`,




});




return{




file,




implementation:change,



};



}),




);




return{




plan:implementationPlan,




changes:fileChanges,



};


}

```

## Evaluator-Optimizer
[](https://developers.cloudflare.com/agents/patterns/#evaluator-optimizer)
One LLM generates responses while another provides evaluation and feedback in a loop.
!Figure 5: Evaluator-Optimizer
TypeScript```


import {openai} from '@ai-sdk/openai';




import {generateText,generateObject} from 'ai';




import {z} from 'zod';




asyncfunctiontranslateWithFeedback(text:string,targetLanguage:string){




letcurrentTranslation='';




letiterations=0;




constMAX_ITERATIONS=3;



// Initial translation



const{text:translation}=awaitgenerateText({




model:openai('gpt-4o-mini'),// use small model for first attempt




system:'You are an expert literary translator.',




prompt:`Translate this text to ${targetLanguage}, preserving tone and cultural nuances:




${text}`,




});




currentTranslation=translation;



// Evaluation-optimization loop



while (iterations<MAX_ITERATIONS) {



// Evaluate current translation



const{object:evaluation}=awaitgenerateObject({




model:openai('gpt-4o'),// use a larger model to evaluate




schema:z.object({




qualityScore:z.number().min(1).max(10),




preservesTone:z.boolean(),




preservesNuance:z.boolean(),




culturallyAccurate:z.boolean(),




specificIssues:z.array(z.string()),




improvementSuggestions:z.array(z.string()),




}),




system:'You are an expert in evaluating literary translations.',




prompt:`Evaluate this translation:




Original: ${text}




Translation: ${currentTranslation}



Consider:


1. Overall quality


2. Preservation of tone


3. Preservation of nuance



4. Cultural accuracy`,




});



// Check if quality meets threshold



if (




evaluation.qualityScore>=8&&




evaluation.preservesTone&&




evaluation.preservesNuance&&




evaluation.culturallyAccurate




) {




break;



}


// Generate improved translation based on feedback



const{text:improvedTranslation}=awaitgenerateText({




model:openai('gpt-4o'),// use a larger model




system:'You are an expert literary translator.',




prompt:`Improve this translation based on the following feedback:




${evaluation.specificIssues.join('\n')}




${evaluation.improvementSuggestions.join('\n')}




Original: ${text}




Current Translation: ${currentTranslation}`,




});




currentTranslation=improvedTranslation;




iterations++;



}



return{




finalTranslation:currentTranslation,




iterationsRequired:iterations,



};


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/patterns.mdx)
Last updated: Sep 3, 2025
 Previous 
Configuration Next 
Build a Human-in-the-loop Agent ↗ 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Cookie Settings



---

# Tools · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/model-context-protocol/tools

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.845199

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 

## On this page
 * Overview 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Model Context Protocol (MCP) 
 5. Tools 

Copy page
# Tools
Model Context Protocol (MCP) tools are functions that a MCP Server provides and MCP clients can call.
When you build MCP Servers with the `agents` package, you can define tools the same way as shown in the `@modelcontextprotocol/typescript-sdk` package's examples ↗.
For example, the following code from this example MCP server ↗ defines a simple MCP server that adds two numbers together:
 * 
 * 

JavaScript```


import {McpServer} from "@modelcontextprotocol/sdk/server/mcp";




import {McpAgent} from "agents/mcp";




exportclassMyMCPextendsMcpAgent{




server =newMcpServer({ name:"Demo", version:"1.0.0"});




asyncinit(){




this.server.tool(




"add",




{ a:z.number(), b:z.number() },




async({a,b})=> ({




content: [{ type:"text", text:String(a+b) }],




}),




);



}


}

```

TypeScript```


import {McpServer} from "@modelcontextprotocol/sdk/server/mcp";




import {McpAgent} from "agents/mcp";




exportclassMyMCPextendsMcpAgent{




server =newMcpServer({ name:"Demo", version:"1.0.0"});




asyncinit(){




this.server.tool(




"add",




{ a:z.number(), b:z.number() },




async({a,b})=> ({




content: [{ type:"text", text:String(a+b) }],




}),




);



}


}

```

## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/model-context-protocol/tools.mdx)
Last updated: Aug 21, 2025
 Previous 
Authorization Next 
Transport 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices

%20%C2%B7%20Cloudflare%20Agents%20docs&_biz_n=16&rnd=927224&cdn_o=a&_biz_z=1760638304586)


---

# Model Context Protocol (MCP) · Cloudflare Agents docs

## URL
https://developers.cloudflare.com/agents/model-context-protocol

## Metadata
- Depth: 1
- Timestamp: 2025-10-16T14:17:07.845338

## Content
Skip to content

Search`⌘``K`
Docs DirectoryAPIsSDKsHelp
 Log in Select theme Dark Light Auto
 **Agents** 
No results found. Try a different search term, or use our global search. 
 * Overview 
 * Getting started
 * Build a Chat Agent ↗ 
 * Testing your Agents 
 * Prompt an AI model ↗ 
 * Concepts
 * Agents 
 * Workflows 
 * Tools 
 * Human in the Loop 
 * Calling LLMs 
 * API Reference
 * Overview 
 * Agents API 
 * Calling Agents 
 * Using AI Models 
 * Schedule tasks 
 * Run Workflows 
 * Store and sync state 
 * Browse the web 
 * HTTP and Server-Sent Events 
 * Retrieval Augmented Generation 
 * Using WebSockets 
 * Configuration 
 * Patterns 
 * Guides
 * Build a Human-in-the-loop Agent ↗ 
 * Implement Effective Agent Patterns ↗ 
 * Build a Remote MCP server 
 * Test a Remote MCP Server 
 * Build a Remote MCP Client ↗ 
 * Model Context Protocol (MCP)
 * Overview 
 * Authorization 
 * Tools 
 * Transport 
 * McpAgent — API Reference 
 * Cloudflare's own MCP servers 
 * MCP server portals ↗ 
 * x402 
 * Platform
 * Limits 
 * Prompt Engineering ↗ 
 * prompt.txt ↗ 
 * LLM resources
 * llms.txt 
 * prompt.txt 
 * Agents llms-full.txt 
 * Developer Platform llms-full.txt 

GitHubX.comYouTube
Select theme Dark Light Auto
On this page Overview 
 * Overview 
 * What is the Model Context Protocol (MCP)? 
 * MCP Terminology 
 * Remote vs. local MCP connections 
 * Best Practices 
 * Get Started 

## On this page
 * Overview 
 * What is the Model Context Protocol (MCP)? 
 * MCP Terminology 
 * Remote vs. local MCP connections 
 * Best Practices 
 * Get Started 

## Tags
 MCP 

## Was this helpful?

 1. Directory 
 2. … 
 3. Agents 
 4. Model Context Protocol (MCP) 

Copy page
# Model Context Protocol (MCP)
You can build and deploy Model Context Protocol (MCP) ↗ servers on Cloudflare.
## What is the Model Context Protocol (MCP)?
[](https://developers.cloudflare.com/agents/model-context-protocol/#what-is-the-model-context-protocol-mcp)
Model Context Protocol (MCP) ↗ is an open standard that connects AI systems with external applications. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various accessories, MCP provides a standardized way to connect AI agents to different services.
### MCP Terminology
[](https://developers.cloudflare.com/agents/model-context-protocol/#mcp-terminology)
 * **MCP Hosts** : AI assistants (like Claude ↗ or Cursor ↗), AI agents, or applications that need to access external capabilities.
 * **MCP Clients** : Clients embedded within the MCP hosts that connect to MCP servers and invoke tools. Each MCP client instance has a single connection to an MCP server.
 * **MCP Servers** : Applications that expose tools, prompts ↗, and resources ↗ that MCP clients can use.

### Remote vs. local MCP connections
[](https://developers.cloudflare.com/agents/model-context-protocol/#remote-vs-local-mcp-connections)
The MCP standard supports two modes of operation:
 * **Remote MCP connections** : MCP clients connect to MCP servers over the Internet, establishing a long-lived connection using HTTP and Server-Sent Events (SSE), and authorizing the MCP client access to resources on the user's account using OAuth.
 * **Local MCP connections** : MCP clients connect to MCP servers on the same machine, using stdio ↗ as a local transport method.

### Best Practices
[](https://developers.cloudflare.com/agents/model-context-protocol/#best-practices)
 * **Tool design** : Do not treat your MCP server as a wrapper around your full API schema. Instead, build tools that are optimized for specific user goals and reliable outcomes. Fewer, well-designed tools often outperform many granular ones, especially for agents with small context windows or tight latency budgets.
 * **Scoped permissions** : Deploying several focused MCP servers, each with narrowly scoped permissions, reduces the risk of over-privileged access and makes it easier to manage and audit what each server is allowed to do.
 * **Tool descriptions** : Detailed parameter descriptions help agents understand how to use your tools correctly — including what values are expected, how they affect behavior, and any important constraints. This reduces errors and improves reliability.
 * **Evaluation tests** : Use evaluation tests ('evals') to measure the agent’s ability to use your tools correctly. Run these after any updates to your server or tool descriptions to catch regressions early and track improvements over time.

### Get Started
[](https://developers.cloudflare.com/agents/model-context-protocol/#get-started)
Go to the Getting Started guide to learn how to build and deploy your first remote MCP server to Cloudflare.
## Was this helpful?
[](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/agents/model-context-protocol/index.mdx)
Last updated: Aug 15, 2025
 Previous 
Build a Remote MCP Client ↗ Next 
Authorization 
 * **Resources**
 * API 
 * New to Cloudflare? 
 * Directory 
 * Sponsorships 
 * Open Source 

 * **Support**
 * Help Center 
 * System Status 
 * Compliance 
 * GDPR 

 * **Company**
 * cloudflare.com 
 * Our team 
 * Careers 

 * **Tools**
 * Cloudflare Radar 
 * Speed Test 
 * Is BGP Safe Yet? 
 * RPKI Toolkit 
 * Certificate Transparency 

 * **Community**
 * 
 * 
 * 
 * 

 * © 2025 Cloudflare, Inc.
 * Privacy Policy 
 * Terms of Use 
 * Report Security Issues 
 * Trademark 
 * !privacy options Your Privacy Choices

%20%C2%B7%20Cloudflare%20Agents%20docs&_biz_n=16&rnd=927224&cdn_o=a&_biz_z=1760638304559)


---
