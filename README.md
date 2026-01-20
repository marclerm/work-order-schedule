# Work Order Schedule

A modern, interactive scheduling application built with **Angular 21** that provides timeline-based visualization and management of work orders across multiple work centers.

## Overview

This project delivers a robust and intuitive scheduling experience with a strong focus on usability, visual clarity, and reactive state management.

Key capabilities include:

- **Timeline Visualization** – View work orders across day, week, and month timescales  
- **Interactive Gantt-Style Timeline** – Select date ranges directly on the timeline to create work orders  
- **Full CRUD Support** – Create, edit, and delete work orders using a slide-out form  
- **Status Management** – Track work orders through open, in-progress, completed, and blocked states  
- **Real-Time UI Updates** – Built with Angular Signals for instant, reactive visual feedback  
- **Responsive & Modern UI** – Clean layout with hover interactions, contextual menus, and visual indicators  

## Features

### Timeline Navigation
- Switch seamlessly between **day**, **week**, and **month** views  
- Automatically scrolls to the current date indicator  
- Horizontal scrolling for extended timelines  

### Work Order Management
- Click empty timeline cells to select a date range  
- Clear visual feedback with a **“Click to add dates”** action pill  
- Form-based data entry with date pickers and status selector  
- Edit existing work orders via contextual three-dot menu  
- Delete work orders with confirmation dialog  

### Visual Indicators
- Color-coded status pills on each work order bar  
- Current day / week / month indicator line  
- Hover effects and interactive controls 

## Tech Stack

- **Angular 21** (Standalone components, Signals)  
- **TypeScript**  
- **SCSS** with custom design tokens
- **ng-select** for dropdowns  
- **Angular Signals** for reactive state management  

## Getting Started

### Prerequisites
- Node.js **24+**  
- npm  
- Angular CLI  
  ```bash
  npm install -g @angular/cli
  ```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd work-order-schedule
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   ng serve
   ```

4. Open your browser at:
   ```
   http://localhost:4200
   ```

### Build for Production
```bash
ng build --configuration production
```

Production artifacts will be generated in the `dist/` directory.

## Project Structure

```
src/app/
├── components/
│   ├── timeline/               # Main timeline & grid rendering
│   ├── work-order-form/        # Create/edit form drawer
│   └── timescale-selector/     # Day / week / month toggle
├── models/                     # TypeScript interfaces & enums
├── utils/                      # Timeline calculations & helpers
├── data/                       # Mock data
└── styles/                     # Global SCSS tokens
```

## Usage

### Creating a Work Order
1. Click an empty cell within a work center row  
2. Click additional cells to extend the date range  
3. Click the **“Click to add dates”** pill  
4. Fill in the work order details and click **Create**  

### Editing a Work Order
1. Hover over an existing work order bar  
2. Click the three-dot menu  
3. Select **Edit**  
4. Modify details and click **Save**  

### Deleting a Work Order
1. Open the three-dot menu on a work order  
2. Click **Delete**  
3. Confirm the action in the dialog  


## License

MIT
