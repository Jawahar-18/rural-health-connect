# 🏥 Rural Health Connect (Swasthya Setu)

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH%202026-Problem%20ID%2026133-16a34a.svg)](https://www.sih.gov.in/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.4-6db33f.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61dafb.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479a1.svg)](https://www.mysql.com/)
[![OpenAPI](https://img.shields.io/badge/API%20Docs-Swagger%203.0-85ea2d.svg)](http://localhost:8080/swagger-ui.html)

> **Theme**: MedTech / BioTech / HealthTech  
> **Problem Statement**: Accessibility and quality of public healthcare services, particularly in rural and underserved areas  
> **Organization**: Government of Maharashtra  

---

## 🌟 Overview

**Rural Health Connect** is a full-stack digital healthcare access platform built to streamline primary healthcare delivery in rural and underserved regions. It connects Community Health Workers (ASHA/ANM), Medical Officers (PHC Doctors), Facility Administrators, District Health Officers (DHO), and Rural Patients into a unified, secure ecosystem.

---

## 🚀 Key Features

1. **Frontline ASHA Worker Portal**:
   - Digital community triage wizard with red-flag clinical urgency detection.
   - Offline-first data capture with automatic bi-directional sync when network connectivity is restored.
   - Proactive high-risk patient outreach with direct **Voice Call** & **Multilingual SMS / WhatsApp** messaging.
2. **Medical Officer & Specialist OPD Hub**:
   - Real-time digital OPD queue monitor with priority token routing.
   - Electronic Medical Records (EMR) & digital prescription generator with essential medicine availability checks.
3. **Closed-Loop Referral Network**:
   - Inter-facility referrals from Sub-Centers & PHCs up to District Hospitals with QR-scannable passcodes.
4. **AI Follow-up Default Risk Engine**:
   - Configurable weighted decision rules predicting missed appointment default risk (0–100%) based on travel distance, chronic conditions, economic vulnerability, and past compliance.
5. **District Governance & Executive KPI Dashboard**:
   - Real-time aggregated healthcare metrics, stock outage alerts, and referral funnel analytics for district health authorities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Lucide Icons, Recharts |
| **Backend** | Java 21, Spring Boot 3.4.3, Spring Data JPA, Hibernate, Spring Security + JWT |
| **Database** | MySQL 8.0 (22 Relational Tables, Realistic Synthetic Maharashtra Dataset) |
| **API Docs** | Springdoc OpenAPI 3.0 & Swagger UI |
| **Build Tools** | Maven & npm |

---

## ⚙️ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ & npm
- **Java JDK**: 21+
- **Maven**: 3.8+
- **MySQL**: 8.0 running on `localhost:3306`

---

### 1. Database Configuration
In `backend/src/main/resources/application.yml` (or via environment variables):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/swasthyasetu?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
    username: root
    password: YOUR_MYSQL_PASSWORD
```

---

### 2. Run the Java Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
- **Backend API**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

### 3. Run the React Frontend
In the root project directory:
```bash
npm install
npm run dev
```
- **Web App**: `http://localhost:5173`

---

## 🔑 Demo Accounts (Password for all: `Password@123`)

| Role | Username | Full Name & Title | Facility / Region |
|---|---|---|---|
| **Doctor** | `dr.deshmukh` | Dr. Rajesh Deshmukh (MBBS, MD) | PHC Junnar, Pune |
| **Health Worker (ASHA)** | `savita.kamble` | Savita Kamble (ASHA Worker) | PHC Junnar, Pune |
| **Facility Admin** | `dr.kulkarni` | Dr. Meena Kulkarni (Medical Officer) | PHC Junnar, Pune |
| **District Admin** | `dr.pawar` | Dr. Suresh Pawar (District Health Officer) | Pune District |
| **Patient** | `anandi.patil` | Anandi Patil (ABHA: `MH-PUN-101`) | Junnar |

---

## 📁 Repository Structure

```
rural-health-connect/
├── backend/                              # Java Spring Boot Backend
│   ├── src/main/java/com/swasthyasetu/
│   │   ├── config/                       # Security & OpenAPI Configurations
│   │   ├── controller/                   # 14 REST API Controllers
│   │   ├── dto/                          # Data Transfer Objects
│   │   ├── entity/                       # 22 JPA Entities
│   │   ├── mapper/                       # Entity-DTO Mappers
│   │   ├── repository/                   # 21 Spring Data JPA Repositories
│   │   ├── seed/                         # Synthetic Database Seeder (50+ Profiles)
│   │   └── service/                      # Business & AI Decision Services
│   ├── src/main/resources/
│   │   └── application.yml               # Configurable Rule Engine Weights & DB Props
│   └── pom.xml                           # Maven Dependencies
├── src/                                  # React 19 Frontend
│   ├── components/                       # Common, AI, and Triage UI Components
│   ├── context/                          # Auth, Offline, and Multilingual Contexts
│   ├── pages/                            # Role-based Dashboards & Views
│   ├── services/apiService.ts            # Client API Layer with Offline Fallback
│   └── types/index.ts                    # TypeScript Interfaces
├── package.json
└── README.md
```

---

## 📜 License
Developed for Smart India Hackathon (SIH 2026) under Apache License 2.0.
