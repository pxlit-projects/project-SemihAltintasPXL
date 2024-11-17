# Architecture

## Gebruiker
**Rol:**  
Een gebruiker met acties zoals:
- Het bekijken van gepubliceerde berichten.
- Het reageren op berichten.
- Het filteren en zoeken naar specifieke berichten.
- Het beheren van hun eigen reacties en opmerkingen.

**Relatie:**  
Gebruikt de Single Page Application (SPA) om deze functies te benaderen.

## Editor (Redacteur)
**Rol:**  
Een redacteur kan:
- Nieuwe berichten aanmaken en bewerken.
- Berichten opslaan als concept.
- Feedback geven op afgewezen berichten.

**Relatie:**  
Maakt gebruik van de SPA om berichten te beheren.

## Single Page Application (SPA)
**Rol:**  
Biedt de gebruikersinterface voor gebruikers en redacteuren om toegang te krijgen tot alle functionaliteiten, zoals het maken, bekijken, en bewerken van berichten en reacties.

**Relatie:**  
Maakt gebruik van API-aanroepen naar de microservices zoals Post API, Review API, en Comment API via de Gateway API. Verzendt configuratieverzoeken naar ConfigService en gebruikt de Eureka Service voor service discovery.

## Gateway API
**Rol:**  
Dient als een centrale toegangspoort die API-aanroepen van de SPA afhandelt en deze doorstuurt naar de juiste microservices.

**Relatie:**  
Fungeert als een tussenlaag tussen de SPA en andere services zoals Post API, Review API, en Comment API.

## Open-Feign Browser
**Rol:**  
Een REST-client die communiceert met andere microservices, waarbij load balancing wordt toegepast.

**Relatie:**  
Versturen en ontvangen van berichten via HTTP om interactie mogelijk te maken met andere API's in het systeem.

## ConfigService
**Rol:**  
Verzorgt de centrale configuratie voor alle microservices binnen het systeem.

**Relatie:**  
Alle services (bijv. Post API, Review API, Comment API) halen hun configuratie-instellingen op via deze service.

## Eureka Service (Service Discovery)
**Rol:**  
Maakt service-registratie en -ontdekking mogelijk, zodat microservices elkaar kunnen vinden zonder directe afhankelijkheid van IP-adressen.