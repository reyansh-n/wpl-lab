/* ---------- Helpers ---------- */
function clearBox(box) { box.innerHTML = ''; }

function log(box, message, type) {
    const p = document.createElement('p');
    p.textContent = message;
    if (type) p.className = type;          // "error" or "success"
    box.appendChild(p);
}

/* ---------- Task 1: Array + reduce() + conditional discount ---------- */
const charges = [
    { name: 'Consultation - Cardiology', price: 800 },
    { name: 'Blood Test (CBC)', price: 450 },
    { name: 'X-Ray Chest', price: 600 },
    { name: 'Pharmacy Medicines', price: 350 }
];
const DISCOUNT_LIMIT = 2000;
const DISCOUNT_RATE = 0.10;

const billList = document.getElementById('billList');
charges.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><span>Rs. ${item.price}</span>`;
    billList.appendChild(li);
});

document.getElementById('calcBill').addEventListener('click', () => {
    const subtotal = charges.reduce((sum, item) => sum + item.price, 0);
    const discount = subtotal > DISCOUNT_LIMIT ? subtotal * DISCOUNT_RATE : 0;
    const finalAmount = subtotal - discount;
    document.getElementById('billOutput').innerHTML =
        `Subtotal: Rs. ${subtotal.toFixed(2)}<br>` +
        `Discount (10% for bills over Rs. ${DISCOUNT_LIMIT}): -Rs. ${discount.toFixed(2)}<br>` +
        `<strong>Final Amount: Rs. ${finalAmount.toFixed(2)}</strong>`;
});

/* ---------- Task 2: Buttons change their own text using "this" ---------- */
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const originalText = this.dataset.label;
        this.textContent = this.dataset.done;     // "this" = the clicked button
        this.disabled = true;
        setTimeout(() => {                         // arrow function keeps "this"
            this.textContent = originalText;
            this.disabled = false;
        }, 1500);
    });
});

/* ---------- Task 3: Live character counter ---------- */
const symptoms = document.getElementById('symptoms');
const charCount = document.getElementById('charCount');
symptoms.addEventListener('input', function () {
    charCount.textContent = this.value.length;
});

/* ---------- Task 4: Registration form validation ---------- */
const regForm = document.getElementById('regForm');
const regStatus = document.getElementById('regStatus');

function setError(id, message) {
    const input = document.getElementById(id);
    document.getElementById(id + 'Error').textContent = message;
    if (input) input.classList.toggle('input-error', message !== '');
    return message === '';                          // true when the field is valid
}

regForm.addEventListener('submit', function (event) {
    event.preventDefault();                         // stop page reload

    const name = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const gender = regForm.querySelector('input[name="gender"]:checked');

    let ok = true;
    ok = setError('fullName', /^[A-Za-z][A-Za-z .'-]+$/.test(name) ? '' : 'Name must be at least 2 characters and contain only letters.') && ok;
    ok = setError('mobile', /^[6-9]\d{9}$/.test(mobile) ? '' : 'Enter a valid 10-digit mobile number (starts with 6-9).') && ok;
    ok = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.') && ok;
    ok = setError('password', /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password) ? '' : 'Password must be at least 6 characters with a letter and a number.') && ok;
    ok = setError('confirmPassword', confirm !== '' && confirm === password ? '' : 'Passwords do not match.') && ok;
    ok = setError('gender', gender ? '' : 'Please select a gender.') && ok;

    if (ok) {
        regStatus.className = 'ok';
        regStatus.textContent = `Registration successful! Welcome, ${name}.`;
        regForm.reset();
    } else {
        regStatus.className = 'bad';
        regStatus.textContent = 'Please fix the errors above before submitting.';
    }
});

/* ---------- Task 5: Nested callbacks ---------- */
const mealOutput = document.getElementById('mealOutput');

function selectFood(callback) {
    setTimeout(() => { log(mealOutput, 'Step 1: Food selected - Veg Khichdi & Fruit Bowl (Ward 3, Bed 12).'); callback(); }, 1000);
}
function confirmOrder(callback) {
    setTimeout(() => { log(mealOutput, 'Step 2: Order confirmed.'); callback(); }, 1000);
}
function prepareFood(callback) {
    setTimeout(() => { log(mealOutput, 'Step 3: Food is being prepared in the hospital kitchen.'); callback(); }, 1500);
}
function assignDeliveryPartner(callback) {
    setTimeout(() => { log(mealOutput, 'Step 4: Delivery partner Suresh assigned.'); callback(); }, 1000);
}
function deliverFood(callback) {
    setTimeout(() => { log(mealOutput, 'Step 5: Food delivered to the ward. Get well soon!', 'success'); callback(); }, 1500);
}

const mealBtn = document.getElementById('mealBtn');
mealBtn.addEventListener('click', () => {
    clearBox(mealOutput);
    mealBtn.disabled = true;
    selectFood(() => {
        confirmOrder(() => {
            prepareFood(() => {
                assignDeliveryPartner(() => {
                    deliverFood(() => {
                        mealBtn.disabled = false;     // chain finished
                    });
                });
            });
        });
    });
});

/* ---------- Task 6: Promise chaining ---------- */
const medicines = [
    { name: 'Paracetamol 500mg', price: 35, stock: 40 },
    { name: 'ORS Sachets', price: 25, stock: 15 },
    { name: 'Vitamin D3 Capsules', price: 120, stock: 0 }     // out of stock
];
const medicineSelect = document.getElementById('medicineSelect');
medicines.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${m.name} - Rs. ${m.price}`;
    medicineSelect.appendChild(opt);
});

function selectProduct(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => medicines[index] ? resolve(medicines[index]) : reject(new Error('Medicine not found.')), 800);
    });
}
function checkAvailability(product) {
    return new Promise((resolve, reject) => {
        setTimeout(() => product.stock > 0 ? resolve(product) : reject(new Error(`"${product.name}" is out of stock.`)), 1000);
    });
}
function addToCart(product) {
    return new Promise(resolve => setTimeout(() => resolve(product), 800));
}
function makePayment(product) {
    return new Promise(resolve => setTimeout(() => resolve(product), 1200));
}
function generateOrderConfirmation(product) {
    return new Promise(resolve => setTimeout(() => resolve('ORD' + Math.floor(10000 + Math.random() * 90000)), 800));
}

const pharmacyOutput = document.getElementById('pharmacyOutput');
const pharmacyBtn = document.getElementById('pharmacyBtn');
pharmacyBtn.addEventListener('click', () => {
    clearBox(pharmacyOutput);
    pharmacyBtn.disabled = true;

    selectProduct(medicineSelect.value)
        .then(p => { log(pharmacyOutput, `Step 1: Medicine selected - ${p.name}.`); return checkAvailability(p); })
        .then(p => { log(pharmacyOutput, `Step 2: "${p.name}" is in stock.`); return addToCart(p); })
        .then(p => { log(pharmacyOutput, `Step 3: "${p.name}" added to cart.`); return makePayment(p); })
        .then(p => { log(pharmacyOutput, `Step 4: Payment of Rs. ${p.price} successful.`); return generateOrderConfirmation(p); })
        .then(orderId => log(pharmacyOutput, `Step 5: Order confirmed! Order ID: ${orderId}.`, 'success'))
        .catch(err => log(pharmacyOutput, `Order failed: ${err.message}`, 'error'))
        .finally(() => { pharmacyBtn.disabled = false; });
});

/* ---------- Task 7: async/await + try...catch...finally ---------- */
function delay(ms, work) {      // returns a Promise that settles after ms
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try { resolve(work()); } catch (error) { reject(error); }
        }, ms);
    });
}
const selectDoctor = () => delay(800, () => ({ name: 'Dr. Amit Sharma', dept: 'Cardiology', fee: 800 }));
const checkSlotAvailability = doc => delay(1000, () => doc);
const reserveSlot = doc => delay(1000, () => ({ ...doc, slot: '10:30 AM' }));
const makeAppointmentPayment = booking => delay(1200, () => {
    if (Math.random() < 0.2) throw new Error('Payment failed. Please try again.');   // ~20% failure
    return booking;
});
const generateToken = booking => delay(800, () => 'TKN-' + Math.floor(1000 + Math.random() * 9000));

const bookOutput = document.getElementById('bookOutput');
const bookBtn = document.getElementById('bookBtn');

async function bookAppointment() {
    clearBox(bookOutput);
    bookBtn.disabled = true;
    try {
        const doctor = await selectDoctor();
        log(bookOutput, `Step 1: Doctor selected - ${doctor.name} (${doctor.dept}).`);
        await checkSlotAvailability(doctor);
        log(bookOutput, `Step 2: Slots available with ${doctor.name}.`);
        const booking = await reserveSlot(doctor);
        log(bookOutput, `Step 3: Slot reserved at ${booking.slot}.`);
        await makeAppointmentPayment(booking);
        log(bookOutput, `Step 4: Payment of Rs. ${booking.fee} successful.`);
        const token = await generateToken(booking);
        log(bookOutput, `Step 5: Appointment confirmed! Token: ${token}.`, 'success');
    } catch (error) {
        log(bookOutput, `Booking failed: ${error.message}`, 'error');
    } finally {
        bookBtn.disabled = false;
    }
}
bookBtn.addEventListener('click', bookAppointment);
