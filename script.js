
let vehicles = [];
let customers = [];
let transactions = [];

const $ = id => document.getElementById(id);

const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));

const fmt = date => date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
    : '-';

function notify(message) {
    const toast = $('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 2800);
}

function badge(status) {
    const cls = String(status).toLowerCase();
    return `<span class="status ${esc(cls)}">${esc(status)}</span>`;
}

async function api(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

/* LOAD DATABASE DATA */

async function refreshAll() {
    try {
        const data = await api('/api/data');

        vehicles = data.vehicles || [];
        customers = data.customers || [];
        transactions = data.transactions || [];

        renderAll();

    } catch (error) {
        console.error(error);
        notify('Database error: ' + error.message);
    }
}

/* GENERAL RENDERING */

function renderAll() {
    renderVehicles($('vehicle-search')?.value || '');
    renderCustomers($('customer-search')?.value || '');
    renderAvailability();
    renderLedger($('ledger-search')?.value || '');

    renderRecent();
    renderDropdowns();
    renderRentalHistory();
    renderReturnHistory();

    updateStatistics();

    if (window.lucide) {
        lucide.createIcons();
    }
}

/* VEHICLE MANAGEMENT */

function renderVehicles(search = '') {
    const filtered = vehicles.filter(v =>
        `${v.code} ${v.name} ${v.registration}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const table = $('vehicle-table');
    if (!table) return;

    table.innerHTML = filtered.length
        ? filtered.map(v => `
            <tr>
                <td>${esc(v.code)}</td>
                <td>${esc(v.name)}</td>
                <td>${esc(v.registration)}</td>
                <td>${esc(v.type)}</td>
                <td>${esc(v.year || '-')}</td>
                <td>${badge(v.status)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="6" class="empty">No vehicles found</td></tr>`;
}

/* CUSTOMER MANAGEMENT */

function renderCustomers(search = '') {
    const filtered = customers.filter(c =>
        `${c.code} ${c.name} ${c.phone} ${c.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const table = $('customer-table');
    if (!table) return;

    table.innerHTML = filtered.length
        ? filtered.map(c => `
            <tr>
                <td>${esc(c.code)}</td>
                <td>${esc(c.name)}</td>
                <td>${esc(c.phone)}</td>
                <td>${esc(c.email || '-')}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="4" class="empty">No customers found</td></tr>`;
}

/* AVAILABILITY */

function renderAvailability() {
    const table = $('availability-table');
    if (!table) return;

    table.innerHTML = vehicles.length
        ? vehicles.map(v => `
            <tr>
                <td>${esc(v.code)}</td>
                <td>${esc(v.name)}</td>
                <td>${esc(v.registration)}</td>
                <td>${esc(v.type)}</td>
                <td>${badge(v.status)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" class="empty">No vehicles registered</td></tr>`;
}

/* RENTAL AND RETURN HELPERS */

function getActiveRentals() {
    return transactions.filter(t =>
        t.type === 'Rental' &&
        !transactions.some(x =>
            x.type === 'Return' && x.rentalId === t.code
        )
    );
}

function vehicleName(id, fallback) {
    return vehicles.find(v => Number(v.id) === Number(id))?.name || fallback || '-';
}

function customerName(id) {
    return customers.find(c => Number(c.id) === Number(id))?.name || '-';
}

/* RENTAL HISTORY */

function renderRentalHistory() {
    const table = $('rental-history-table');
    if (!table) return;

    const rentals = transactions.filter(t => t.type === 'Rental');

    table.innerHTML = rentals.length
        ? rentals.map(t => {
            const returned = transactions.some(x =>
                x.type === 'Return' && x.rentalId === t.code
            );

            return `
                <tr>
                    <td>${esc(t.code)}</td>
                    <td>${esc(vehicleName(t.vehicleId, t.vehicleCode))}</td>
                    <td>${esc(customerName(t.customerId))}</td>
                    <td>${fmt(t.date)}</td>
                    <td>${badge(returned ? 'Returned' : 'Active')}</td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="5" class="empty">No rental records yet</td></tr>`;
}

/* RETURN HISTORY */

function renderReturnHistory() {
    const table = $('return-history-table');
    if (!table) return;

    const returns = transactions.filter(t => t.type === 'Return');

    table.innerHTML = returns.length
        ? returns.map(t => `
            <tr>
                <td>${esc(t.code)}</td>
                <td>${esc(vehicleName(t.vehicleId, t.vehicleCode))}</td>
                <td>${esc(customerName(t.customerId))}</td>
                <td>${fmt(t.date)}</td>
                <td>${badge('Completed')}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" class="empty">No return records yet</td></tr>`;
}

/* TRANSACTION LEDGER */

function renderLedger(search = '') {
    const table = $('ledger-table');
    if (!table) return;

    const filtered = transactions.filter(t =>
        `${t.code} ${t.type} ${t.vehicleCode} ${t.customerCode} ${t.date}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    table.innerHTML = filtered.length
        ? filtered.map(t => `
            <tr>
                <td>${esc(t.code)}</td>
                <td>${badge(t.type)}</td>
                <td>${esc(vehicleName(t.vehicleId, t.vehicleCode))}</td>
                <td>${esc(customerName(t.customerId))}</td>
                <td>${fmt(t.date)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" class="empty">No transactions found</td></tr>`;
}

/* DASHBOARD RECENT TRANSACTIONS */

function renderRecent() {
    const table = $('recent-transactions');
    if (!table) return;

    const recent = transactions.slice(0, 5);

    table.innerHTML = recent.length
        ? recent.map(t => `
            <tr>
                <td>${esc(t.code)}</td>
                <td>${esc(vehicleName(t.vehicleId, t.vehicleCode))}</td>
                <td>${badge(t.type)}</td>
                <td>${fmt(t.date)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="4" class="empty">No transactions yet</td></tr>`;
}

/* DROPDOWN MENUS */

function renderDropdowns() {
    const availableVehicles = vehicles.filter(v => v.status === 'Available');
    const activeRentals = getActiveRentals();

    if ($('rental-vehicle')) {
        $('rental-vehicle').innerHTML =
            '<option value="">Select available vehicle</option>' +
            availableVehicles.map(v =>
                `<option value="${v.id}">${esc(v.code + ' - ' + v.name)}</option>`
            ).join('');
    }

    if ($('rental-customer')) {
        $('rental-customer').innerHTML =
            '<option value="">Select customer</option>' +
            customers.map(c =>
                `<option value="${c.id}">${esc(c.code + ' - ' + c.name)}</option>`
            ).join('');
    }

    if ($('return-rental')) {
        $('return-rental').innerHTML =
            '<option value="">Select active rental</option>' +
            activeRentals.map(t =>
                `<option value="${t.id}">${esc(t.code + ' - ' + t.vehicleCode + ' / ' + t.customerCode)}</option>`
            ).join('');
    }
}

/* ALL STATISTICS */

function updateStatistics() {
    const totalVehicles = vehicles.length;
    const totalCustomers = customers.length;
    const rented = vehicles.filter(v => v.status === 'Rented').length;
    const available = totalVehicles - rented;

    const rentals = transactions.filter(t => t.type === 'Rental').length;
    const returns = transactions.filter(t => t.type === 'Return').length;
    const activeRentals = getActiveRentals().length;

    const values = {
        'total-vehicles': totalVehicles,
        'total-customers': totalCustomers,
        'active-rentals': activeRentals,
        'available-vehicles': available,

        'vehicle-total': totalVehicles,
        'vehicle-available': available,
        'vehicle-rented': rented,

        'customer-total': totalCustomers,

        'rental-total': rentals,
        'rental-active': activeRentals,
        'rental-available': available,

        'return-total': returns,
        'return-pending': activeRentals,

        'availability-total': totalVehicles,
        'availability-available': available,
        'availability-rented': rented,

        'ledger-total': transactions.length,
        'ledger-rentals': rentals,
        'ledger-returns': returns,

        'report-rentals': rentals,
        'report-returns': returns,
        'report-available': available,
        'report-rented': rented,

        'summary-vehicles': totalVehicles,
        'summary-customers': totalCustomers,
        'summary-transactions': transactions.length,
        'summary-active': activeRentals
    };

    Object.entries(values).forEach(([id, value]) => {
        if ($(id)) {
            $(id).textContent = value;
        }
    });
}

/* PAGE NAVIGATION */

const pageTitles = {
    dashboard: 'Dashboard Overview',
    vehicles: 'Vehicle Management',
    customers: 'Customer Management',
    rentals: 'Rental Management',
    returns: 'Vehicle Returns',
    availability: 'Vehicle Availability',
    ledger: 'Transaction Ledger',
    reports: 'Reports & Analytics'
};

function navigate(page) {
    document.querySelectorAll('.page').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    $(page)?.classList.add('active');

    document.querySelector(`.nav-link[data-page="${page}"]`)
        ?.classList.add('active');

    if ($('breadcrumb')) {
        $('breadcrumb').textContent = pageTitles[page] || page;
    }

    if ($('page-heading')) {
        $('page-heading').textContent = pageTitles[page] || page;
    }
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        navigate(link.dataset.page);
    });
});

/* FORM OPEN AND CLOSE */

function openForm(id) {
    $(id)?.classList.remove('hidden');
}

function closeForm(id) {
    $(id)?.classList.add('hidden');

    const formId = id === 'vehicle-form'
        ? 'add-vehicle-form'
        : id === 'customer-form'
            ? 'add-customer-form'
            : null;

    if (formId) {
        $(formId)?.reset();
    }
}

/* ADD VEHICLE */

$('add-vehicle-form')?.addEventListener('submit', async event => {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        await api('/api/vehicles', {
            method: 'POST',
            body: JSON.stringify({
                registration: form.get('registration'),
                name: form.get('name')
            })
        });

        event.target.reset();
        closeForm('vehicle-form');

        await refreshAll();
        notify('Vehicle successfully registered.');

    } catch (error) {
        notify(error.message);
    }
});

/* ADD CUSTOMER */

$('add-customer-form')?.addEventListener('submit', async event => {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        await api('/api/customers', {
            method: 'POST',
            body: JSON.stringify({
                name: form.get('name'),
                phone: form.get('phone')
            })
        });

        event.target.reset();
        closeForm('customer-form');

        await refreshAll();
        notify('Customer successfully registered.');

    } catch (error) {
        notify(error.message);
    }
});

/* CREATE RENTAL */

$('rental-form')?.addEventListener('submit', async event => {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        await api('/api/rentals', {
            method: 'POST',
            body: JSON.stringify({
                vehicle: form.get('vehicle'),
                customer: form.get('customer'),
                date: form.get('date')
            })
        });

        event.target.reset();

        if ($('rental-date')) {
            $('rental-date').value = today();
        }

        await refreshAll();
        notify('Rental successfully recorded.');

    } catch (error) {
        notify(error.message);
    }
});

/* PROCESS RETURN */

$('return-form')?.addEventListener('submit', async event => {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        await api('/api/returns', {
            method: 'POST',
            body: JSON.stringify({
                rental: form.get('rental'),
                date: form.get('date')
            })
        });

        event.target.reset();

        if ($('return-date')) {
            $('return-date').value = today();
        }

        await refreshAll();
        notify('Vehicle return successfully recorded.');

    } catch (error) {
        notify(error.message);
    }
});

/* SEARCH */

$('vehicle-search')?.addEventListener('input', event => {
    renderVehicles(event.target.value);
});

$('customer-search')?.addEventListener('input', event => {
    renderCustomers(event.target.value);
});

$('ledger-search')?.addEventListener('input', event => {
    renderLedger(event.target.value);
});

/* CSV EXPORT */

function exportCSV() {
    const rows = [
        ['Transaction ID', 'Type', 'Vehicle', 'Customer', 'Date'],
        ...transactions.map(t => [
            t.code,
            t.type,
            vehicleName(t.vehicleId, t.vehicleCode),
            customerName(t.customerId),
            t.date
        ])
    ];

    const csv = rows.map(row =>
        row.map(value =>
            '"' + String(value ?? '').replace(/"/g, '""') + '"'
        ).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csv], {
        type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'VeloRent_Transaction_Report.csv';
    link.click();

    URL.revokeObjectURL(url);
}

/* INITIAL SETTINGS */

if ($('rental-date')) {
    $('rental-date').max = today();
    $('rental-date').value = today();
}

if ($('return-date')) {
    $('return-date').max = today();
    $('return-date').value = today();
}

if ($('today-date')) {
    $('today-date').textContent = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/* START APPLICATION */

refreshAll();
