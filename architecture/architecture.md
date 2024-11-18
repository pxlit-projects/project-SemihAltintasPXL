# Architecture
![Semih_Altintas_c4_model drawio](https://github.com/user-attachments/assets/461d97c9-f7ae-4b59-9472-d898f4d9445f)

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


## Relaties en Interactie tussen Componenten

### API-aanroepen
De Single Page Application (SPA) maakt gebruik van HTTP-verzoeken om functionaliteiten aan te spreken binnen verschillende service-API’s, zoals de PostService API, ReviewService API, en CommentService API. Deze API’s bieden toegang tot respectieve functies, zoals het beheren van berichten, beoordelingen, en reacties.

### Berichtenuitwisseling
De RabbitMQ-container fungeert als een centrale broker voor de communicatie tussen microservices, wat zorgt voor asynchrone gegevensuitwisseling. Hierdoor kunnen de services berichten verzenden en ontvangen zonder dat ze direct afhankelijk zijn van elkaar.

### Gegevensopslag
Elke microservice heeft een eigen SQL-database voor het beheren van zijn specifieke data (bijvoorbeeld artikelen, reviews, en reacties). De toegang tot deze gegevens wordt geregeld door de bijbehorende API’s.

## Communicatie via OpenFeign
### API Gateway naar Microservices
OpenFeign dient als een declaratieve REST-client om de communicatie tussen de API Gateway en de onderliggende services te vereenvoudigen:

- **Gebruikersacties:** Wanneer een gebruiker of redacteur een actie uitvoert via de SPA (zoals het creëren van een artikel of het plaatsen van een reactie), wordt een verzoek naar de API Gateway gestuurd.
- **Routering door de Gateway:** Deze verzoeken worden vervolgens doorgestuurd naar de juiste service met behulp van OpenFeign:
  - Voor het creëren van nieuwe artikelen wordt de PostService API aangesproken.
  - Voor het ophalen of verwerken van goedkeuringen wordt de ReviewService API benaderd.
  - Voor het aanmaken of verwijderen van reacties wordt de CommentService API ingezet.

### Interne Service-naar-Service Communicatie
Daarnaast wordt OpenFeign ook gebruikt voor directe communicatie tussen microservices:

- **ReviewService ↔ PostService:** De ReviewService haalt artikelinformatie op via OpenFeign tijdens het goedkeuringsproces.
- **CommentService ↔ PostService:** De CommentService verifieert of een artikel bestaat voordat een reactie kan worden toegevoegd.

## Asynchrone Communicatie met RabbitMQ

### Publiceren van Berichten
Microservices maken gebruik van de RabbitMQ-queue om belangrijke gebeurtenissen te communiceren:

- **PostService:** publiceert een bericht bij het aanmaken of wijzigen van een artikel.
- **ReviewService:** stuurt een bericht uit wanneer een artikel wordt goedgekeurd of afgewezen.
- **CommentService:** publiceert een bericht wanneer een nieuwe reactie wordt geplaatst of verwijderd.

### Consumeren van Berichten
De volgende microservices lezen berichten uit de queue om hun processen bij te werken:

- **ReviewService:** ontvangt berichten om de status van artikelen te actualiseren (goedkeuring of afwijzing).
- **CommentService:** houdt zich bezig met het verwerken van reacties; bijvoorbeeld, bij verwijdering van een artikel wordt een bericht verstuurd om de bijbehorende reacties te verwijderen.

### Notificaties voor Gebruikers
Een voorbeeld van het gebruik van de message bus is het versturen van meldingen:

- Wanneer een artikel wordt goedgekeurd of een nieuwe reactie wordt geplaatst, plaatst een notificatieservice een bericht op de queue.
- Een dedicated service, zoals de EmailService, haalt dit bericht op en verstuurt een notificatie-e-mail naar de betrokken gebruikers.