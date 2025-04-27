# Integration Guide

This document provides guidance on how to integrate different components of the Birbal AI tech stack.

## Overview of Integration Points

The Birbal AI tech stack consists of three main layers that need to communicate with each other:

1. Frontend (React/Next.js)
2. Backend (Node.js/Express)
3. ML Pipeline (Python/TensorFlow)

![Integration Points](./assets/architecture-diagram.svg)

## Frontend-Backend Integration

### REST API Communication

The primary method of integration between frontend and backend is through REST APIs:

```typescript
// Example: Frontend API call to backend
import { apiRequest } from '@/lib/queryClient';

// GET request
const fetchData = async () => {
  const response = await apiRequest('GET', '/api/content');
  return response.json();
};

// POST request
const createItem = async (data) => {
  const response = await apiRequest('POST', '/api/content', data);
  return response.json();
};
