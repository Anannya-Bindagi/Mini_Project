
// ==========================================
// VELORENT - VEHICLE RENTAL SYSTEM
// COMPLETE FRONTEND JAVASCRIPT
// ==========================================

// STORAGE
let vehicles = JSON.parse(localStorage.getItem("vr_vehicles") || "[]");
let customers = JSON.parse(localStorage.getItem("vr_customers") || "[]");
let transactions = JSON.parse(localStorage.getItem("vr_transactions") || "[]");

// ==========================================
// 1. SAMPLE CUSTOMERS - 10 CUSTOMERS
// ==========================================

if (customers.length === 0) {
    customers = [
        { id: "CUS001", name: "Rahul Sharma", phone: "9000000001", email: "rahul@gmail.com", address: "Vidyanagar", city: "Hubli", state: "Karnataka", pincode: "580021", licenseNumber: "KA01DL1001", customerType: "Regular", registrationDate: "2026-01-10" },
        { id: "CUS002", name: "Priya Patel", phone: "9000000002", email: "priya@gmail.com", address: "Gokul Road", city: "Hubli", state: "Karnataka", pincode: "580030", licenseNumber: "KA01DL1002", customerType: "Premium", registrationDate: "2026-01-12" },
        { id: "CUS003", name: "Amit Kumar", phone: "9000000003", email: "amit@gmail.com", address: "Dharwad", city: "Dharwad", state: "Karnataka", pincode: "580001", licenseNumber: "KA01DL1003", customerType: "Regular", registrationDate: "2026-02-05" },
        { id: "CUS004", name: "Sneha Rao", phone: "9000000004", email: "sneha@gmail.com", address: "Keshwapur", city: "Hubli", state: "Karnataka", pincode: "580023", licenseNumber: "KA01DL1004", customerType: "Premium", registrationDate: "2026-02-10" },
        { id: "CUS005", name: "Arjun Singh", phone: "9000000005", email: "arjun@gmail.com", address: "Jubilee Circle", city: "Dharwad", state: "Karnataka", pincode: "580002", licenseNumber: "KA01DL1005", customerType: "Regular", registrationDate: "2026-03-01" },
        { id: "CUS006", name: "Ananya Reddy", phone: "9000000006", email: "ananya@gmail.com", address: "Saptapur", city: "Dharwad", state: "Karnataka", pincode: "580008", licenseNumber: "KA01DL1006", customerType: "Regular", registrationDate: "2026-03-12" },
        { id: "CUS007", name: "Karan Mehta", phone: "9000000007", email: "karan@gmail.com", address: "Unkal", city: "Hubli", state: "Karnataka", pincode: "580031", licenseNumber: "KA01DL1007", customerType: "Premium", registrationDate: "2026-04-02" },
        { id: "CUS008", name: "Pooja Verma", phone: "9000000008", email: "pooja@gmail.com", address: "Navanagar", city: "Hubli", state: "Karnataka", pincode: "580025", licenseNumber: "KA01DL1008", customerType: "Regular", registrationDate: "2026-04-15" },
        { id: "CUS009", name: "Rohit Shetty", phone: "9000000009", email: "rohit@gmail.com", address: "Malmaddi", city: "Dharwad", state: "Karnataka", pincode: "580007", licenseNumber: "KA01DL1009", customerType: "Regular", registrationDate: "2026-05-05" },
        { id: "CUS010", name: "Neha Kulkarni", phone: "9000000010", email: "neha@gmail.com", address: "Raj Nagar", city: "Hubli", state: "Karnataka", pincode: "580032", licenseNumber: "KA01DL1010", customerType: "Premium", registrationDate: "2026-05-20" }
    ];
    saveData();
}

// ==========================================
// 2. SAMPLE VEHICLES - 10 VEHICLES
// ==========================================

if (vehicles.length === 0) {
    vehicles = [
        { id: "VEH001", registration: "KA01AB1234", name: "Maruti Swift", type: "Hatchback", year: "2023" },
        { id: "VEH002", registration: "KA03CD5678", name: "Hyundai i20", type: "Hatchback", year: "2024" },
        { id: "VEH003", registration: "KA05EF9012", name: "Tata Nexon", type: "SUV", year: "2023" },
        { id: "VEH004", registration: "KA02GH3456", name: "Honda City", type: "Sedan", year: "2022" },
        { id: "VEH005", registration: "KA04IJ7890", name: "Toyota Innova", type: "MPV", year: "2024" },
        { id: "VEH006", registration: "KA25KL1234", name: "Kia Seltos", type: "SUV", year: "2023" },
        { id: "VEH007", registration: "KA26MN5678", name: "Mahindra Thar", type: "SUV", year: "2024" },
        { id: "VEH008", registration: "KA27OP9012", name: "Renault Kwid", type: "Hatchback", year: "2022" },
        { id: "VEH009", registration: "KA28QR3456", name: "Honda Amaze", type: "Sedan", year: "2023" },
        { id: "VEH010", registration: "KA29ST7890", name: "Toyota Fortuner", type: "SUV", year: "2024" }
    ];
    saveData();
}

// ==========================================
// 3. SAMPLE TRANSACTIONS
// 10 RENTALS + 5 RETURNS
// ==========================================

if (transactions.length === 0) {
    transactions = [
        // Completed rentals
        { id: "TR001", type: "Rental", vehicleId: "VEH001", customerId: "CUS001", date: "2026-11-01", createdAt: "2026-11-01T09:00:00" },
        { id: "TR002", type: "Rental", vehicleId: "VEH002", customerId: "CUS002", date: "2026-11-02", createdAt: "2026-11-02T09:00:00" },
        { id: "TR003", type: "Rental", vehicleId: "VEH003", customerId: "CUS003", date: "2026-11-03", createdAt: "2026-11-03T09:00:00" },
        { id: "TR004", type: "Rental", vehicleId: "VEH004", customerId: "CUS004", date: "2026-11-04", createdAt: "2026-11-04T09:00:00" },
        { id: "TR005", type: "Rental", vehicleId: "VEH005", customerId: "CUS005", date: "2026-11-05", createdAt: "2026-11-05T09:00:00" },

        // Active rentals
        { id: "TR006", type: "Rental", vehicleId: "VEH006", customerId: "CUS006", date: "2026-11-06", createdAt: "2026-11-06T09:00:00" },
        { id: "TR007", type: "Rental", vehicleId: "VEH007", customerId: "CUS007", date: "2026-11-07", createdAt: "2026-11-07T09:00:00" },
        { id: "TR008", type: "Rental", vehicleId: "VEH008", customerId: "CUS008", date: "2026-11-08", createdAt: "2026-11-08T09:00:00" },
        { id: "TR009", type: "Rental", vehicleId: "VEH009", customerId: "CUS009", date: "2026-11-09", createdAt: "2026-11-09T09:00:00" },
        { id: "TR010", type: "Rental", vehicleId: "VEH010", customerId: "CUS010", date: "2026-11-10", createdAt: "2026-11-10T09:00:00" },

        // Returns linked to completed rentals
        { id: "TR011", type: "Return", rentalId: "TR001", vehicleId: "VEH001", customerId: "CUS001", date: "2026-11-02", createdAt: "2026-11-02T17:00:00" },
        { id: "TR012", type: "Return", rentalId: "TR002", vehicleId: "VEH002", customerId: "CUS002", date: "2026-11-03", createdAt: "2026-11-03T17:00:00" },
        { id: "TR013", type: "Return", rentalId: "TR003", vehicleId: "VEH003", customerId: "CUS003", date: "2026-11-04", createdAt: "2026-11-04T17:00:00" },
        { id: "TR014", type: "Return", rentalId: "TR004", vehicleId: "VEH004", customerId: "CUS004", date: "2026-11-05", createdAt: "2026-11-05T17:00:00" },
        { id: "TR015", type: "Return", rentalId: "TR005", vehicleId: "VEH005", customerId: "CUS005", date: "2026-11-06", createdAt: "2026-11-06T17:00:00" }
    ];
    saveData();
}

// ==========================================
// 4. PAGE TITLES - KEEP THIS SECTION
// ==========================================

const pageTitles = {
    dashboard: "Dashboard Overview",
    vehicles: "Vehicle Management",
    customers: "Customer Management",
    rentals: "Create New Rental",
    returns: "Vehicle Returns",
    availability: "Vehicle Availability",
    ledger: "Transaction Ledger",
    reports: "Reports & Analytics"
};

// ==========================================
// 5. STORAGE AND NOTIFICATIONS
// ==========================================

function saveData() {
    localStorage.setItem("vr_vehicles", JSON.stringify(vehicles));
    localStorage.setItem("vr_customers", JSON.stringify(customers));
    localStorage.setItem("vr_transactions", JSON.stringify(transactions));
}

function notify(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2800);
}

function refreshIcons() {
    if (window.lucide) lucide.createIcons();
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date) {
    if (!date) return "-";
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function statusBadge(status) {
    return `<span class="status ${status.toLowerCase()}">${escapeHTML(status)}</span>`;
}

// ==========================================
// 6. VEHICLE STATUS
// ==========================================

function activeRental(vehicleId) {
    return transactions.find(transaction =>
        transaction.type === "Rental" &&
        transaction.vehicleId === vehicleId &&
        !transactions.some(returnTransaction =>
            returnTransaction.type === "Return" &&
            returnTransaction.rentalId === transaction.id
        )
    );
}

function vehicleStatus(vehicleId) {
    return activeRental(vehicleId) ? "Rented" : "Available";
}

// ==========================================
// 7. NAVIGATION
// ==========================================

function navigate(page) {
    document.querySelectorAll(".page").forEach(section =>
        section.classList.remove("active")
    );

    document.querySelectorAll(".nav-link").forEach(link =>
        link.classList.remove("active")
    );

    const target = document.getElementById(page);
    if (!target) return;

    target.classList.add("active");

    const activeLink = document.querySelector(
        `.nav-link[data-page="${page}"]`
    );

    if (activeLink) activeLink.classList.add("active");

    const heading = pageTitles[page] || "VeloRent";

    const breadcrumb = document.getElementById("breadcrumb");
    const pageHeading = document.getElementById("page-heading");

    if (breadcrumb) breadcrumb.textContent = heading;
    if (pageHeading) pageHeading.textContent = heading;

    refreshAll();
    refreshIcons();
}

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        navigate(this.dataset.page);
    });
});

// ==========================================
// 8. FORM OPEN AND CLOSE
// ==========================================

function openForm(id) {
    document.getElementById(id)?.classList.remove("hidden");
}

function closeForm(id) {
    document.getElementById(id)?.classList.add("hidden");

    const formId = id === "vehicle-form"
        ? "add-vehicle-form"
        : "add-customer-form";

    document.getElementById(formId)?.reset();
}

// ==========================================
// 9. ADD VEHICLE
// ==========================================

document.getElementById("add-vehicle-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(this);
    const id = form.get("id").trim().toUpperCase();
    const registration = form.get("registration").trim().toUpperCase();

    if (vehicles.some(vehicle =>
        vehicle.id === id || vehicle.registration === registration
    )) {
        notify("Vehicle ID or registration already exists.");
        return;
    }

    vehicles.push({
        id,
        registration,
        name: form.get("name").trim(),
        type: form.get("type"),
        year: form.get("year")
    });

    saveData();
    this.reset();
    closeForm("vehicle-form");
    refreshAll();
    notify("Vehicle added successfully.");
});

// ==========================================
// 10. ADD CUSTOMER
// ==========================================

document.getElementById("add-customer-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(this);
    const id = form.get("id").trim().toUpperCase();
    const phone = form.get("phone").trim();

    if (customers.some(customer =>
        customer.id === id || customer.phone === phone
    )) {
        notify("Customer ID or phone number already exists.");
        return;
    }

    customers.push({
        id,
        name: form.get("name").trim(),
        phone,
        email: form.get("email").trim()
    });

    saveData();
    this.reset();
    closeForm("customer-form");
    refreshAll();
    notify("Customer added successfully.");
});

// ==========================================
// 11. CREATE RENTAL
// ==========================================

document.getElementById("rental-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(this);
    const id = form.get("id").trim().toUpperCase();
    const vehicleId = form.get("vehicle");
    const customerId = form.get("customer");
    const date = form.get("date");

    if (transactions.some(transaction => transaction.id === id)) {
        notify("Transaction ID already exists.");
        return;
    }

    const vehicle = vehicles.find(item => item.id === vehicleId);
    const customer = customers.find(item => item.id === customerId);

    if (!vehicle || !customer) {
        notify("Please select a valid vehicle and customer.");
        return;
    }

    if (vehicleStatus(vehicleId) === "Rented") {
        notify("This vehicle is already rented.");
        return;
    }

    if (date > today()) {
        notify("Rental date cannot be in the future.");
        return;
    }

    transactions.push({
        id,
        type: "Rental",
        vehicleId,
        customerId,
        date,
        createdAt: new Date().toISOString()
    });

    saveData();
    this.reset();
    refreshAll();
    notify("Rental recorded successfully.");
});

// ==========================================
// 12. VEHICLE RETURN
// ==========================================

document.getElementById("return-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(this);
    const id = form.get("id").trim().toUpperCase();
    const rentalId = form.get("rental");
    const date = form.get("date");

    if (transactions.some(transaction => transaction.id === id)) {
        notify("Transaction ID already exists.");
        return;
    }

    const rental = transactions.find(transaction =>
        transaction.id === rentalId && transaction.type === "Rental"
    );

    if (!rental || activeRental(rental.vehicleId)?.id !== rental.id) {
        notify("Selected rental is not active.");
        return;
    }

    if (date < rental.date || date > today()) {
        notify("Please select a valid return date.");
        return;
    }

    transactions.push({
        id,
        type: "Return",
        rentalId,
        vehicleId: rental.vehicleId,
        customerId: rental.customerId,
        date,
        createdAt: new Date().toISOString()
    });

    saveData();
    this.reset();
    refreshAll();
    notify("Vehicle return recorded successfully.");
});

// ==========================================
// 13. VEHICLE TABLE
// ==========================================

function renderVehicles(search = "") {
    const table = document.getElementById("vehicle-table");
    if (!table) return;

    const filtered = vehicles.filter(vehicle =>
        `${vehicle.id} ${vehicle.name} ${vehicle.registration} ${vehicle.type}`
            .toLowerCase().includes(search.toLowerCase())
    );

    if (!filtered.length) {
        table.innerHTML = `<tr><td colspan="6" class="empty">No vehicles found</td></tr>`;
        return;
    }

    table.innerHTML = filtered.map(vehicle => `
        <tr>
            <td><strong>${escapeHTML(vehicle.id)}</strong></td>
            <td>${escapeHTML(vehicle.name)}</td>
            <td>${escapeHTML(vehicle.registration)}</td>
            <td>${escapeHTML(vehicle.type)}</td>
            <td>${escapeHTML(vehicle.year)}</td>
            <td>${statusBadge(vehicleStatus(vehicle.id))}</td>
        </tr>
    `).join("");
}

// ==========================================
// 14. CUSTOMER TABLE
// ==========================================

function renderCustomers(search = "") {
    const table = document.getElementById("customer-table");
    if (!table) return;

    const filtered = customers.filter(customer =>
        `${customer.id} ${customer.name} ${customer.phone} ${customer.email}`
            .toLowerCase().includes(search.toLowerCase())
    );

    if (!filtered.length) {
        table.innerHTML = `<tr><td colspan="4" class="empty">No customers found</td></tr>`;
        return;
    }

    table.innerHTML = filtered.map(customer => `
        <tr>
            <td><strong>${escapeHTML(customer.id)}</strong></td>
            <td>${escapeHTML(customer.name)}</td>
            <td>${escapeHTML(customer.phone)}</td>
            <td>${escapeHTML(customer.email || "-")}</td>
        </tr>
    `).join("");
}

// ==========================================
// 15. AVAILABILITY TABLE
// ==========================================

function renderAvailability() {
    const table = document.getElementById("availability-table");
    if (!table) return;

    if (!vehicles.length) {
        table.innerHTML = `<tr><td colspan="5" class="empty">No vehicles registered</td></tr>`;
        return;
    }

    table.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td>${escapeHTML(vehicle.id)}</td>
            <td>${escapeHTML(vehicle.name)}</td>
            <td>${escapeHTML(vehicle.registration)}</td>
            <td>${escapeHTML(vehicle.type)}</td>
            <td>${statusBadge(vehicleStatus(vehicle.id))}</td>
        </tr>
    `).join("");
}

// ==========================================
// 16. TRANSACTION LEDGER
// ==========================================

function renderLedger(search = "") {
    const table = document.getElementById("ledger-table");
    if (!table) return;

    const sorted = [...transactions].sort((a, b) =>
        a.date.localeCompare(b.date) ||
        a.createdAt.localeCompare(b.createdAt)
    );

    const filtered = sorted.filter(transaction => {
        const vehicle = vehicles.find(item => item.id === transaction.vehicleId);
        const customer = customers.find(item => item.id === transaction.customerId);

        return `${transaction.id} ${transaction.type} ${vehicle?.name || ""} ${customer?.name || ""} ${transaction.date}`
            .toLowerCase().includes(search.toLowerCase());
    });

    if (!filtered.length) {
        table.innerHTML = `<tr><td colspan="5" class="empty">No transactions found</td></tr>`;
        return;
    }

    table.innerHTML = filtered.map(transaction => {
        const vehicle = vehicles.find(item => item.id === transaction.vehicleId);
        const customer = customers.find(item => item.id === transaction.customerId);

        return `
            <tr>
                <td><strong>${escapeHTML(transaction.id)}</strong></td>
                <td>${statusBadge(transaction.type)}</td>
                <td>${escapeHTML(vehicle?.name || transaction.vehicleId)}</td>
                <td>${escapeHTML(customer?.name || "-")}</td>
                <td>${formatDate(transaction.date)}</td>
            </tr>
        `;
    }).join("");
}

// ==========================================
// 17. RECENT TRANSACTIONS
// ==========================================

function renderRecentTransactions() {
    const table = document.getElementById("recent-transactions");
    if (!table) return;

    const recent = [...transactions]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5);

    if (!recent.length) {
        table.innerHTML = `<tr><td colspan="4" class="empty">No transactions yet</td></tr>`;
        return;
    }

    table.innerHTML = recent.map(transaction => {
        const vehicle = vehicles.find(item => item.id === transaction.vehicleId);

        return `
            <tr>
                <td>${escapeHTML(transaction.id)}</td>
                <td>${escapeHTML(vehicle?.name || transaction.vehicleId)}</td>
                <td>${statusBadge(transaction.type)}</td>
                <td>${formatDate(transaction.date)}</td>
            </tr>
        `;
    }).join("");
}

// ==========================================
// 18. RENTAL AND RETURN DROPDOWNS
// ==========================================

function renderDropdowns() {
    const rentalVehicle = document.getElementById("rental-vehicle");
    const rentalCustomer = document.getElementById("rental-customer");
    const returnRental = document.getElementById("return-rental");

    if (!rentalVehicle || !rentalCustomer || !returnRental) return;

    const selectedVehicle = rentalVehicle.value;
    const selectedCustomer = rentalCustomer.value;
    const selectedRental = returnRental.value;

    const available = vehicles.filter(vehicle =>
        vehicleStatus(vehicle.id) === "Available"
    );

    rentalVehicle.innerHTML =
        `<option value="">Select available vehicle</option>` +
        available.map(vehicle =>
            `<option value="${escapeHTML(vehicle.id)}">${escapeHTML(vehicle.id)} - ${escapeHTML(vehicle.name)}</option>`
        ).join("");

    rentalCustomer.innerHTML =
        `<option value="">Select customer</option>` +
        customers.map(customer =>
            `<option value="${escapeHTML(customer.id)}">${escapeHTML(customer.id)} - ${escapeHTML(customer.name)}</option>`
        ).join("");

    const active = transactions.filter(transaction =>
        transaction.type === "Rental" &&
        activeRental(transaction.vehicleId)?.id === transaction.id
    );

    returnRental.innerHTML =
        `<option value="">Select active rental</option>` +
        active.map(rental => {
            const vehicle = vehicles.find(item => item.id === rental.vehicleId);
            const customer = customers.find(item => item.id === rental.customerId);

            return `<option value="${escapeHTML(rental.id)}">${escapeHTML(rental.id)} - ${escapeHTML(vehicle?.name || rental.vehicleId)} / ${escapeHTML(customer?.name || rental.customerId)}</option>`;
        }).join("");

    if (available.some(vehicle => vehicle.id === selectedVehicle)) {
        rentalVehicle.value = selectedVehicle;
    }

    if (customers.some(customer => customer.id === selectedCustomer)) {
        rentalCustomer.value = selectedCustomer;
    }

    if (active.some(rental => rental.id === selectedRental)) {
        returnRental.value = selectedRental;
    }
}

// ==========================================
// 19. DASHBOARD AND REPORTS
// ==========================================

function refreshDashboard() {
    const rented = vehicles.filter(vehicle =>
        vehicleStatus(vehicle.id) === "Rented"
    ).length;

    const available = vehicles.length - rented;

    const rentalCount = transactions.filter(item =>
        item.type === "Rental"
    ).length;

    const returnCount = transactions.filter(item =>
        item.type === "Return"
    ).length;

    const values = {
        "total-vehicles": vehicles.length,
        "total-customers": customers.length,
        "active-rentals": rented,
        "available-vehicles": available,
        "report-rentals": rentalCount,
        "report-returns": returnCount,
        "report-available": available,
        "report-rented": rented
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// ==========================================
// 20. SEARCH
// ==========================================

document.getElementById("vehicle-search")?.addEventListener("input", event => {
    renderVehicles(event.target.value);
});

document.getElementById("customer-search")?.addEventListener("input", event => {
    renderCustomers(event.target.value);
});

document.getElementById("ledger-search")?.addEventListener("input", event => {
    renderLedger(event.target.value);
});

// ==========================================
// 21. CSV EXPORT
// ==========================================

function exportCSV() {
    if (!transactions.length) {
        notify("No transactions available to export.");
        return;
    }

    const rows = [
        ["Transaction ID", "Type", "Vehicle ID", "Customer ID", "Date"],
        ...transactions.map(transaction => [
            transaction.id,
            transaction.type,
            transaction.vehicleId,
            transaction.customerId,
            transaction.date
        ])
    ];

    const csv = rows.map(row =>
        row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "VeloRent_Transaction_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
    notify("Transaction report downloaded.");
}

// ==========================================
// 22. DATE INITIALIZATION
// ==========================================

const todayDate = document.getElementById("today-date");

if (todayDate) {
    todayDate.textContent = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

const rentalDate = document.getElementById("rental-date");
const returnDate = document.getElementById("return-date");

if (rentalDate) {
    rentalDate.max = today();
    rentalDate.value = today();
}

if (returnDate) {
    returnDate.max = today();
    returnDate.value = today();
}

// ==========================================
// 23. REFRESH ALL
// ==========================================

function refreshAll() {
    renderVehicles(document.getElementById("vehicle-search")?.value || "");
    renderCustomers(document.getElementById("customer-search")?.value || "");
    renderAvailability();
    renderLedger(document.getElementById("ledger-search")?.value || "");
    renderRecentTransactions();
    renderDropdowns();
    refreshDashboard();
}

// ==========================================
// 24. INITIALIZE APPLICATION
// ==========================================

refreshAll();
refreshIcons();
