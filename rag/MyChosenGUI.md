# DarkPan Bootstrap 5 Admin Template - Component Guide

This document provides detailed HTML/CSS specifications for creating two components from the DarkPan Bootstrap 5 Admin Template. Use this guide to recreate these components with pixel-perfect accuracy.

**Source:** https://htmlcodex.com/demo/?item=2384
**Template:** DarkPan - Bootstrap 5 Admin Template
**Repository:** https://github.com/technext/darkpan

---

## Color Palette

### Bootstrap 5 Custom Properties (CSS Variables)

```css
--bs-primary: #EB1616       /* Red - Primary accent color */
--bs-secondary: #191C24     /* Dark navy - Secondary background */
--bs-success: #198754       /* Green */
--bs-danger: #dc3545        /* Danger red */
--bs-warning: #ffc107       /* Yellow */
--bs-info: #0dcaf0          /* Cyan */
--bs-light: #6C7293         /* Muted gray - Light text color */
--bs-dark: #000             /* Black - Dark background */
```

### Core Colors

- **Background (body):** `#000000` (black)
- **Text Color:** `#6C7293` (muted gray)
- **White:** `#ffffff`
- **Border Color:** `#000000`

---

## Component 1: Recent Salse (Recent Sales Table)

### Complete HTML Structure

```html
<div class="container-fluid pt-4 px-4">
    <div class="bg-secondary text-center rounded p-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
            <h6 class="mb-0">Recent Salse</h6>
            <a href="">Show All</a>
        </div>
        <div class="table-responsive">
            <table class="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                    <tr class="text-white">
                        <th scope="col"><input class="form-check-input" type="checkbox"></th>
                        <th scope="col">Date</th>
                        <th scope="col">Invoice</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input class="form-check-input" type="checkbox"></td>
                        <td>01 Jan 2045</td>
                        <td>INV-0123</td>
                        <td>Jhon Doe</td>
                        <td>$123</td>
                        <td>Paid</td>
                        <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
                    </tr>
                    <tr>
                        <td><input class="form-check-input" type="checkbox"></td>
                        <td>01 Jan 2045</td>
                        <td>INV-0123</td>
                        <td>Jhon Doe</td>
                        <td>$123</td>
                        <td>Paid</td>
                        <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
                    </tr>
                    <tr>
                        <td><input class="form-check-input" type="checkbox"></td>
                        <td>01 Jan 2045</td>
                        <td>INV-0123</td>
                        <td>Jhon Doe</td>
                        <td>$123</td>
                        <td>Paid</td>
                        <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
                    </tr>
                    <tr>
                        <td><input class="form-check-input" type="checkbox"></td>
                        <td>01 Jan 2045</td>
                        <td>INV-0123</td>
                        <td>Jhon Doe</td>
                        <td>$123</td>
                        <td>Paid</td>
                        <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
                    </tr>
                    <tr>
                        <td><input class="form-check-input" type="checkbox"></td>
                        <td>01 Jan 2045</td>
                        <td>INV-0123</td>
                        <td>Jhon Doe</td>
                        <td>$123</td>
                        <td>Paid</td>
                        <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
```

### CSS Styling Specifications

#### Container Styling

```css
.container-fluid {
    width: 100%;
    padding-right: var(--bs-gutter-x, 0.75rem);
    padding-left: var(--bs-gutter-x, 0.75rem);
    margin-right: auto;
    margin-left: auto;
}

.pt-4 {
    padding-top: 1.5rem !important;
}

.px-4 {
    padding-right: 1.5rem !important;
    padding-left: 1.5rem !important;
}
```

#### Card/Background Styling

```css
.bg-secondary {
    background-color: #191C24 !important;  /* Dark navy background */
}

.rounded {
    border-radius: 5px !important;
}

.p-4 {
    padding: 1.5rem !important;
}

.text-center {
    text-align: center !important;
}
```

#### Header Section

```css
.d-flex {
    display: flex !important;
}

.align-items-center {
    align-items: center !important;
}

.justify-content-between {
    justify-content: space-between !important;
}

.mb-4 {
    margin-bottom: 1.5rem !important;
}

.mb-0 {
    margin-bottom: 0 !important;
}

h6 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    color: #6C7293;
}

a {
    color: #EB1616;  /* Primary color for links */
    text-decoration: none;
}

a:hover {
    color: #c81313;  /* Darker red on hover */
}
```

#### Table Styling

```css
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table {
    --bs-table-bg: rgba(0,0,0,0);
    --bs-table-striped-bg: rgba(0,0,0,0.05);
    --bs-table-hover-bg: rgba(0,0,0,0.075);
    width: 100%;
    margin-bottom: 1rem;
    color: #6C7293;
    vertical-align: top;
    border-color: #000;
}

.table-bordered {
    border: 1px solid #000;
}

.table-bordered > :not(caption) > * {
    border-width: 1px 0;
}

.table-bordered > :not(caption) > * > * {
    border-width: 0 1px;
}

.table-hover > tbody > tr:hover {
    background-color: rgba(0, 0, 0, 0.075);
    color: #6C7293;
}

.text-start {
    text-align: left !important;
}

.align-middle {
    vertical-align: middle !important;
}
```

#### Table Header

```css
thead tr.text-white {
    color: #fff !important;
}

th {
    padding: 0.5rem 0.5rem;
    background-color: rgba(0, 0, 0, 0);
    border-bottom-width: 1px;
    box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
}
```

#### Table Body

```css
tbody tr {
    border-color: inherit;
    border-style: solid;
    border-width: 0;
}

td {
    padding: 0.5rem 0.5rem;
    background-color: rgba(0, 0, 0, 0);
    border-bottom-width: 1px;
    box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
}
```

#### Form Controls (Checkbox)

```css
.form-check-input {
    width: 1em;
    height: 1em;
    margin-top: 0.25em;
    vertical-align: top;
    background-color: #000;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 1px solid rgba(0, 0, 0, 0.25);
    appearance: none;
}

.form-check-input:focus {
    border-color: #f58b8b;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(235, 22, 22, 0.25);
}

.form-check-input:checked {
    background-color: #EB1616;
    border-color: #EB1616;
}
```

#### Button Styling

```css
.btn {
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    color: #6C7293;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    transition: color 0.15s ease-in-out,
                background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out,
                box-shadow 0.15s ease-in-out;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
}

.btn-primary {
    color: #fff;
    background-color: #EB1616;
    border-color: #EB1616;
}

.btn-primary:hover {
    color: #fff;
    background-color: #c81313;
    border-color: #bc1212;
}

.btn-primary:focus {
    color: #fff;
    background-color: #c81313;
    border-color: #bc1212;
    box-shadow: 0 0 0 0.25rem rgba(237, 58, 58, 0.5);
}

.btn-primary:active {
    color: #fff;
    background-color: #bc1212;
    border-color: #b01111;
}
```

---

## Component 2: Doughnut Chart

### Complete HTML Structure

```html
<div class="col-sm-12 col-xl-6">
    <div class="bg-secondary rounded h-100 p-4">
        <h6 class="mb-4">Doughnut Chart</h6>
        <canvas id="doughnut-chart"></canvas>
    </div>
</div>
```

### CSS Styling Specifications

#### Grid Column Styling

```css
.col-sm-12 {
    flex: 0 0 auto;
    width: 100%;
}

@media (min-width: 1200px) {
    .col-xl-6 {
        flex: 0 0 auto;
        width: 50%;
    }
}
```

#### Card/Container Styling

```css
.bg-secondary {
    background-color: #191C24 !important;  /* Dark navy background */
}

.rounded {
    border-radius: 5px !important;
}

.h-100 {
    height: 100% !important;
}

.p-4 {
    padding: 1.5rem !important;
}
```

#### Heading Styling

```css
h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    color: #6C7293;
}

.mb-4 {
    margin-bottom: 1.5rem !important;
}
```

#### Canvas Element

```css
canvas {
    display: block;
    box-sizing: border-box;
    height: auto;
    width: 100%;
}

#doughnut-chart {
    /* Chart.js will handle the canvas rendering */
    /* Typical height for doughnut charts: 300px-400px */
}
```

### Chart.js Configuration (Reference)

**Note:** The actual chart rendering requires Chart.js library. Here's the typical configuration pattern used in DarkPan:

```javascript
// Chart.js Doughnut Chart Example Configuration
var ctx = document.getElementById("doughnut-chart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Label 1", "Label 2", "Label 3"],
        datasets: [{
            backgroundColor: [
                "rgba(235, 22, 22, .7)",    // Primary red
                "rgba(235, 22, 22, .5)",    // Primary red lighter
                "rgba(235, 22, 22, .3)"     // Primary red even lighter
            ],
            data: [55, 49, 44]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true
    }
});
```

---

## Bootstrap 5 Spacing Scale Reference

For consistent spacing across components:

```css
/* Padding (p-*) and Margin (m-*) values */
.p-0, .m-0 { value: 0; }
.p-1, .m-1 { value: 0.25rem; }   /* 4px */
.p-2, .m-2 { value: 0.5rem; }    /* 8px */
.p-3, .m-3 { value: 1rem; }      /* 16px */
.p-4, .m-4 { value: 1.5rem; }    /* 24px */
.p-5, .m-5 { value: 3rem; }      /* 48px */

/* Directional spacing */
pt-* { padding-top }
pb-* { padding-bottom }
ps-* { padding-left }
pe-* { padding-right }
px-* { padding-left and padding-right }
py-* { padding-top and padding-bottom }

mt-* { margin-top }
mb-* { margin-bottom }
ms-* { margin-left }
me-* { margin-right }
mx-* { margin-left and margin-right }
my-* { margin-top and margin-bottom }
```

---

## Additional Styling Notes

### Custom Theme Extensions (from style.css)

```css
/* Primary accent color */
:root {
    --primary: #EB1616;
}

/* Sidebar styling */
.sidebar {
    width: 250px;
    overflow-y: auto;
}

/* Content area */
.content {
    margin-left: 250px;
    min-height: 100vh;
}

/* Interactive elements */
.btn,
.nav-link,
a {
    transition: 0.5s;
}

.nav-link:hover,
a:hover {
    color: var(--primary);
}

/* Border radius patterns */
.navbar .dropdown-toggle::after {
    border: none;
}

.navbar .navbar-nav .nav-link {
    padding: 0 10px;
    color: var(--light);
}

.btn.btn-square {
    width: 36px;
    height: 36px;
    border-radius: 40px;
}
```

### Responsive Breakpoints

```css
/* Mobile First - Default: < 576px */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { }

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) { }
```

---

## Implementation Checklist

When recreating these components in SPFx or any other framework:

### Recent Salse Table
- [ ] Use dark navy background (#191C24)
- [ ] Include header with title and "Show All" link
- [ ] Apply table-bordered and table-hover classes
- [ ] Use white text for table headers
- [ ] Include checkbox column with form-check-input styling
- [ ] Style "Detail" button with btn-primary (red #EB1616)
- [ ] Add hover effect on table rows (semi-transparent overlay)
- [ ] Ensure responsive table wrapper (table-responsive)

### Doughnut Chart
- [ ] Use dark navy background (#191C24)
- [ ] Set responsive grid columns (col-sm-12 col-xl-6)
- [ ] Apply full height (h-100) and padding (p-4)
- [ ] Include heading with bottom margin (mb-4)
- [ ] Add canvas element with unique ID
- [ ] Configure Chart.js with primary color variants
- [ ] Ensure responsive and maintainAspectRatio options

### Color Consistency
- [ ] Primary color: #EB1616 (red)
- [ ] Secondary background: #191C24 (dark navy)
- [ ] Text color: #6C7293 (muted gray)
- [ ] Background: #000000 (black)
- [ ] Borders: #000000 (black)
- [ ] White text: #ffffff

---

## Usage in SPFx WebParts

When implementing in SharePoint Framework:

1. **Import Bootstrap 5** or replicate styles in your SCSS module
2. **Use CSS Modules** to scope styles to your web part
3. **Apply theme-aware colors** using SharePoint theme tokens when appropriate
4. **Chart Library:** Import Chart.js via npm: `npm install chart.js --save`
5. **Responsive Design:** Test on SharePoint mobile view and Teams

### Example SCSS Module Pattern

```scss
@import '~@microsoft/sp-office-ui-fabric-core/dist/sass/SPFabricCore.scss';

// DarkPan color variables
$primary: #EB1616;
$secondary: #191C24;
$light: #6C7293;
$dark: #000;

.recentSalesContainer {
    background-color: $secondary;
    border-radius: 5px;
    padding: 1.5rem;

    .tableHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;

        h6 {
            color: $light;
            margin: 0;
        }

        a {
            color: $primary;
            text-decoration: none;

            &:hover {
                color: darken($primary, 10%);
            }
        }
    }

    table {
        width: 100%;
        border: 1px solid $dark;
        color: $light;

        thead {
            color: white;
        }

        tr:hover {
            background-color: rgba(0, 0, 0, 0.075);
        }
    }
}

.doughnutChartContainer {
    background-color: $secondary;
    border-radius: 5px;
    padding: 1.5rem;
    height: 100%;

    h6 {
        color: $light;
        margin-bottom: 1.5rem;
    }
}
```

---

**End of Component Guide**

This documentation provides all necessary HTML structure and CSS styling to recreate the "Doughnut Chart" and "Recent Salse" components from the DarkPan Bootstrap 5 Admin Template with pixel-perfect accuracy.
