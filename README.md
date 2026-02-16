# RiverSense – River Conditions & Fishing Trip Tracker

**RiverSense v0.1**  
Brought to you by AtlasFishing.app  
**Team:** Atlas (Esteban Salazar & Berry Walker)  
**Date:** February 2026  

RiverSense is a responsive, web-based prototype application that assists recreational anglers in making informed fishing decisions. It combines real-time environmental data from public APIs with personal fishing trip logging capabilities. The current iteration focuses on displaying river conditions and enabling local storage of trip records, serving as a functional foundation for future enhancements.

## System Overview

RiverSense integrates publicly available river flow data and weather forecasts to present current fishing conditions in an accessible format. Users can select a river, view key metrics, log fishing trips (including catch details and notes), and review past entries—all through a browser on any internet-connected device. The application emphasizes responsiveness and ADA compliance to ensure broad usability.

**Core Goals**  
- Provide anglers with actionable, real-time environmental insights.  
- Enable simple, persistent tracking of personal fishing experiences.  
- Deliver a clean, mobile-friendly interface suitable for field use.

## Features (Current Prototype – v0.1)

- River selection and display of current conditions  
- Real-time river discharge data from the USGS API  
- Weather summary, temperature, wind, precipitation chance, and sunrise/sunset times from the OpenWeather API  
- Local fishing trip logging (date, river name, catch count, notes) using browser storage  
- View and review saved past trips  
- Responsive design compatible with desktop, tablet, and mobile devices  
- ADA-compliant layout and keyboard navigation support  

**Future Phases (Out of Scope for v0.1)**  
- Interactive map selection  
- User accounts and cloud synchronization  
- Historical analytics and pattern recognition  
- Favorite river bookmarking  
- Predictive fishing recommendations  

## User Stories Addressed in v0.1

1. As an angler, select a river to view its current fishing conditions.  
2. View river discharge, weather data, and sunrise/sunset information to assess favorability.  
3. Log a fishing trip with relevant details.  
4. Review previously saved trip logs to identify patterns.  
5. Access the application seamlessly on a mobile device while outdoors.

## Project Structure & Key Components

### Data Models (Class Diagram Summary)

- **Angler** (User): userId, displayName, preferences  
- **River**: riverId, name, usgsSiteCode, state, latitude, longitude  
- **ConditionSnapshot**: snapshotId, riverId, timestamp, dischargeCfs, gaugeHeightFt, weatherSummary, tempF, windMph, precipChance, sunriseTime, sunsetTime  
- **TripLog**: tripId, userId, riverId, date, startTime, endTime, catchCount, notes  

### High-Level Flow

1. Launch application and load main interface with available rivers.  
2. Select a river → Fetch and display environmental data via APIs.  
3. Log a trip → Save details to local storage.  
4. View past trips → Retrieve and display from local storage.
