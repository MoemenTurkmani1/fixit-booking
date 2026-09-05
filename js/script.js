const servicesData = [
  {
    id: "plumbing",
    name: "Plumbing",
    basePrice: 25,
    icon: '<i class="fa-regular fa-wrench" style="color: rgb(138, 134, 120);"></i>',
    description: "Leaks, clogs, installation and general repairs.",
  },

  {
    id: "electrical",
    name: "Electrical",
    basePrice: 30,
    icon: '<i class="fa-solid fa-lightbulb"></i>',
    description: "Faults, wiring, and lighting installation.",
  },

  {
    id: "cleaning",
    name: "Cleaning",
    basePrice: 20,
    icon: '<i class="fa-solid fa-broom"></i>',
    description: "Deep cleaning for homes and offices.",
  },

  {
    id: "moving",
    name: "Moving",
    basePrice: 60,
    icon: '<i class="fa-solid fa-box"></i>',
    description: "Furniture and belongings moving within the city.",
  },

  {
    id: "hvac",
    name: "HVAC & Maintenance",
    basePrice: 35,
    icon: '<i class="fa-solid fa-snowflake"></i>',
    description: "Cleaning and regular maintenance for AC units.",
  },

  {
    id: "painting",
    name: "Painting",
    basePrice: 50,
    icon: '<i class="fa-solid fa-palette"></i>',
    description: "Painting a single room or a full apartment.",
  },
];

const servicesGrid = document.querySelector("#services-grid");

const serviceSelect = document.querySelector("#service-select");

const prioritySelect = document.querySelector("#priority-select");

const distanceInput = document.querySelector("#distance-input");

const roomsInput = document.querySelector("#rooms-input");

const basePriceEl = document.querySelector("#base-price");

const priorityFeeEl = document.querySelector("#priority-fee");

const distanceFeeEl = document.querySelector("#distance-fee");

const numberOfRoomEl = document.querySelector("#number-of-room");

const roomFeeEl = document.querySelector("#room-fee");

const totalPriceEl = document.querySelector("#total-price");

const quoteForm = document.querySelector("#quote-form");

const nameInput = document.querySelector("#name-input");

const phoneInput = document.querySelector("#phone-input");

const addressInput = document.querySelector("#address-input");

const dateInput = document.querySelector("#date-input");

const descriptionInput = document.querySelector("#description-input");

const timeSelect = document.querySelector("#time-select");

const requestsList = document.querySelector("#requests-list");

servicesData.forEach(function (service) {
  const card = document.createElement("div");

  card.className = "service-card";

  card.dataset.id = service.id;

  card.innerHTML = `

        <div class="service-icon">
            ${service.icon}
        </div>

        <h3>
            ${service.name}
        </h3>

        <p>
            ${service.description}
        </p>

        <div class="service-price">

            <span class="from">
                From
            </span>

            <span class="amount">
                $${service.basePrice}
            </span>

        </div>
    `;

  card.addEventListener("click", function () {
    selectService(service.id);
  });

  servicesGrid.appendChild(card);
});

servicesData.forEach(function (service) {
  const option = document.createElement("option");

  option.value = service.id;

  option.textContent = service.name;

  serviceSelect.appendChild(option);
});

function selectService(id) {
  const service = servicesData.find(function (service) {
    return service.id === id;
  });

  if (!service) {
    return;
  }

  const cards = document.querySelectorAll(".service-card");

  cards.forEach(function (card) {
    card.classList.toggle("selected", card.dataset.id === id);
  });

  serviceSelect.value = id;

  updateEstimate();
}

function calculateEstimate(serviceId, priority, distance, rooms = 1) {
  const service = servicesData.find(function (service) {
    return service.id === serviceId;
  });

  if (!service) {
    return null;
  }

  const basePrice = service.basePrice;

  let priorityFee = 0;

  if (priority === "urgent") {
    priorityFee = 15;
  }

  if (priority === "emergency") {
    priorityFee = 30;
  }

  let distanceFee = 0;

  if (distance > 5) {
    distanceFee = (distance - 5) * 2;
  }

  const roomCount = Math.max(1, Number(rooms) || 1);

  const roomFee = (roomCount - 1) * 10;

  const total = basePrice + priorityFee + distanceFee + roomFee;

  return {
    basePrice,
    priorityFee,
    distanceFee,
    roomCount,
    roomFee,
    total,
  };
}

function updateEstimate() {
  const serviceId = serviceSelect.value;

  const priority = prioritySelect.value;

  const distance = Number(distanceInput.value);

  const rooms = Number(roomsInput.value);

  const estimate = calculateEstimate(serviceId, priority, distance, rooms);

  if (!estimate) {
    return;
  }

  basePriceEl.textContent = `$${estimate.basePrice}`;

  priorityFeeEl.textContent = `$${estimate.priorityFee}`;

  distanceFeeEl.textContent = `$${estimate.distanceFee}`;

  numberOfRoomEl.textContent = estimate.roomCount;

  roomFeeEl.textContent = `$${estimate.roomFee}`;

  totalPriceEl.textContent = `$${estimate.total}`;
}

serviceSelect.addEventListener("change", function () {
  selectService(serviceSelect.value);
});

prioritySelect.addEventListener("change", updateEstimate);

distanceInput.addEventListener("input", updateEstimate);

roomsInput.addEventListener("input", updateEstimate);

function checkField(input) {
  const field = input.closest(".field");

  if (input.value.trim() === "") {
    field.classList.add("has-error");

    return false;
  }

  field.classList.remove("has-error");

  return true;
}

function validateForm() {
  let isValid = true;

  if (!checkField(nameInput)) {
    isValid = false;
  }

  if (!checkField(phoneInput)) {
    isValid = false;
  }

  if (!checkField(addressInput)) {
    isValid = false;
  }

  if (!checkField(dateInput)) {
    isValid = false;
  }

  return isValid;
}

function saveRequest(request) {
  const savedRequests = localStorage.getItem("requests");

  const requests = savedRequests ? JSON.parse(savedRequests) : [];

  requests.push(request);

  localStorage.setItem("requests", JSON.stringify(requests));
}

function getRequests() {
  const savedRequests = localStorage.getItem("requests");

  if (!savedRequests) {
    return [];
  }

  try {
    return JSON.parse(savedRequests);
  } catch (error) {
    return [];
  }
}

function deleteRequest(id) {
  const requests = getRequests();

  const newRequests = requests.filter(function (request) {
    return request.id !== id;
  });

  localStorage.setItem("requests", JSON.stringify(newRequests));

  renderRequests();
}

function markReviewed(id) {
  const requests = getRequests();

  const request = requests.find(function (request) {
    return request.id === id;
  });

  if (!request) {
    return;
  }

  request.status = "reviewed";

  localStorage.setItem("requests", JSON.stringify(requests));

  renderRequests();
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const dateObject = new Date(date);

  return dateObject.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getServiceName(id) {
  const service = servicesData.find(function (service) {
    return service.id === id;
  });

  return service ? service.name : id;
}

function renderRequests() {
  const requests = getRequests();

  requestsList.innerHTML = `

        <div class="req-row head">

            <span>Name</span>
            <span>Service</span>
            <span>Appointment</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>

        </div>

    `;

  if (requests.length === 0) {
    requestsList.innerHTML += `

            <div class="req-row">

                <span style="grid-column:1/-1;text-align:center;">
                    No saved requests yet.
                </span>

            </div>

        `;

    return;
  }

  requests.forEach(function (request) {
    const row = document.createElement("div");

    row.className = "req-row";

    const statusClass = request.status === "reviewed" ? "reviewed" : "pending";

    const statusText = request.status === "reviewed" ? "Reviewed" : "Pending";

    row.innerHTML = `

            <span>
                ${request.name}
            </span>

            <span>
                ${getServiceName(request.service)}
            </span>

            <span>
                ${formatDate(request.date)}
                — ${request.time}
            </span>

            <span>
                $${request.price}
            </span>

            <span>
                <span class="status ${statusClass}">
                    ${statusText}
                </span>
            </span>

            <span class="row-actions">

                ${
                  request.status === "pending"
                    ? `
                            <a href="#" class="review-btn">
                                Mark Reviewed
                            </a>
                        `
                    : ""
                }

                <a href="#" class="del delete-btn">
                    Delete
                </a>

            </span>

        `;

    const reviewButton = row.querySelector(".review-btn");

    const deleteButton = row.querySelector(".delete-btn");

    if (reviewButton) {
      reviewButton.addEventListener("click", function (event) {
        event.preventDefault();

        markReviewed(request.id);
      });
    }

    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();

      deleteRequest(request.id);
    });

    requestsList.appendChild(row);
  });
}
quoteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  const estimate = calculateEstimate(
    serviceSelect.value,
    prioritySelect.value,
    Number(distanceInput.value),
    Number(roomsInput.value)
  );

  if (!estimate) {
    return;
  }

  const request = {
    id: Date.now(),

    name: nameInput.value.trim(),

    phone: phoneInput.value.trim(),

    address: addressInput.value.trim(),

    service: serviceSelect.value,

    priority: prioritySelect.value,

    rooms: Number(roomsInput.value),

    distance: Number(distanceInput.value),

    date: dateInput.value,

    description: descriptionInput.value.trim(),

    time: timeSelect.value,

    price: estimate.total,

    status: "pending",
  };

  saveRequest(request);

  updateConfirmation(request);

  renderRequests();

  quoteForm.reset();

  roomsInput.value = 1;

  distanceInput.value = 5;

  serviceSelect.value = servicesData[0].id;

  prioritySelect.value = "standard";

  selectService(servicesData[0].id);

  updateEstimate();
});

function updateConfirmation(request) {
  const confirmationId = document.querySelector("#confirmation-id");

  const confirmationService = document.querySelector("#confirmation-service");

  const confirmationDate = document.querySelector("#confirmation-date");

  const confirmationPrice = document.querySelector("#confirmation-price");

  confirmationId.textContent = `#FX-${String(request.id).slice(-4)}`;

  confirmationService.textContent = getServiceName(request.service);

  confirmationDate.textContent = `${formatDate(request.date)} — ${
    request.time
  }`;

  confirmationPrice.textContent = `$${request.price}`;
}

[nameInput, phoneInput, addressInput, dateInput].forEach(function (input) {
  input.addEventListener("input", function () {
    checkField(input);
  });
});

const menuToggle = document.querySelector("#menu-toggle");

const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);

  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Open menu");

    menuToggle.textContent = "☰";
  });
});

if (servicesData.length > 0) {
  selectService(servicesData[0].id);
}

updateEstimate();

renderRequests();
