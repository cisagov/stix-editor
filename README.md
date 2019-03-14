## Getting Started

To get started you can simply download this project repository.

### Prerequisites

Download  and install Node.js (https://nodejs.org/en/download/). Node.js(https://nodejs.org/en/) is a javascript runtime and comes with npm installed. 
Node.js comes with a preinstalled http server.
Or, you may use any other web server of your choice.

Set user Namespace configuration
The settings(/settings) need to be set to ensure all @ids are prefixed properly.
The namespaces settings are located at the root of the project directory (settings.json) for your convenience.
Populate the XML_Prefix and XML_URI keys with your values (e.g. "XML_Prefix":"YOUR_COMPANY_NAME","XML_URI":"YOUR_DOMAIN") and save!


### Run the Application

Change to the directory containing your project and type:
```
npm start
```
Now browse to the app at [`localhost:8000/index.html`][local-app-url].

### Settings
Each user will provide their own values for XML Prefix and URI through settings.json.
This file is located at in the app directory.

## Directory Layout

```
app/                    --> all of the source files and dependecies for the application
  courses_of_action/    --> Courses of Action
  exploit_targets/      --> Exploit Targets
  export/               --> saving user provided input into valid STIX output
  indicators/           --> Indicators
  layout/               --> main view, settings and release notes
  observables/          --> Observables. This object is 
  package/              --> stix package module and service
  shared/               --> views and services shared by all components
  stix_header/          --> stix header
  ttps/                 --> Tactics, Techniques and Procedures
  settings.json         --> this file specifies XML Prefix and XML URI
  dashboard.css         --> default stylesheet
  app.module.js         --> main application module
  index.html            --> app layout file (the main html template file of the app)
```