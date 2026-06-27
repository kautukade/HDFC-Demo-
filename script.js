/**
 * HDFC NetBanking - Clean & Elegant Vanilla JS Engine
 * Handles login, real-time dynamic dashboard updates, transactions,
 * simulated fund transfers, credit card bill payment, and responsive feedback.
 */

// --- 1. SIMULATED LEDGER STATE ---
const state = {
  savingsBalance: 125000.00,
  creditCardDue: 8450.75,
  isCcPaid: false,
  transactions: [
    { date: "26 Jun 2026", desc: "Salary Credited - Corp Corp", type: "credit", amount: 45000.00, status: "Success" },
    { date: "25 Jun 2026", desc: "UPI Payment - Starbucks", type: "debit", amount: 1250.00, status: "Success" },
    { date: "22 Jun 2026", desc: "ATM Cash Withdrawal", type: "debit", amount: 5000.00, status: "Success" },
    { date: "20 Jun 2026", desc: "Electricity Bill Pay", type: "debit", amount: 2300.00, status: "Success" },
    { date: "18 Jun 2026", desc: "Cashback Reward Points Credited", type: "credit", amount: 150.00, status: "Success" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // --- 2. DOM ELEMENT SELECTORS ---
  // Views
  const loginContainer = document.getElementById("login-container");
  const dashboardContainer = document.getElementById("dashboard-container");

  // Login Form elements
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const eyeIcon = document.getElementById("eye-icon");
  const loginErrorMsg = document.getElementById("login-error");
  const loginBtn = document.getElementById("login-btn");

  // Dashboard Balance elements
  const savingsBalanceEl = document.getElementById("savings-balance");
  const creditBalanceEl = document.getElementById("credit-balance");
  const payCcBtn = document.getElementById("pay-cc-btn");
  const dueDateLabel = document.getElementById("due-date-label");
  const logoutBtn = document.getElementById("logout-btn");

  // Transfer Form elements
  const transferForm = document.getElementById("transfer-form");
  const beneficiaryNameInput = document.getElementById("beneficiary-name");
  const beneficiaryAccInput = document.getElementById("beneficiary-acc");
  const transferAmountInput = document.getElementById("transfer-amount");
  const transferMessageEl = document.getElementById("transfer-message");

  // Quick Action elements
  const actionStatement = document.getElementById("action-statement");
  const actionCards = document.getElementById("action-cards");
  const actionSupport = document.getElementById("action-support");
  const actionProfile = document.getElementById("action-profile");
  const operationToast = document.getElementById("operation-toast");

  // Transaction Table elements
  const txTbody = document.getElementById("tx-tbody");


  // --- 3. PASSWORD VISIBILITY TOGGLER ---
  togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      // Change SVG icon to Eye-off state
      eyeIcon.innerHTML = `
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      `;
    } else {
      passwordInput.type = "password";
      // Restore standard Eye SVG icon
      eyeIcon.innerHTML = `
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      `;
    }
  });


  // --- 4. SECURE DUMMY LOGIN HANDLER ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset error message
    loginErrorMsg.classList.add("hidden");
    loginErrorMsg.textContent = "";

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.textContent = "Verifying Credentials...";

    // Simulated short server delay
    setTimeout(() => {
      if (username === "snehal" && password === "snehal123") {
        // Clear login inputs
        usernameInput.value = "";
        passwordInput.value = "";
        
        // Transition views
        loginContainer.classList.add("hidden");
        dashboardContainer.classList.remove("hidden");

        // Initialize/Refresh Dashboard display
        renderDashboard();
      } else {
        // Display validation warning
        loginErrorMsg.textContent = "Invalid Customer ID or Password. Please try again.";
        loginErrorMsg.classList.remove("hidden");
        
        // Restore login button
        loginBtn.disabled = false;
        loginBtn.textContent = "Secure Login";
      }
    }, 800);
  });


  // --- 5. RENDER DASHBOARD (BALANCE, DUE & TABLES) ---
  function renderDashboard() {
    // Format balances nicely
    savingsBalanceEl.textContent = formatINR(state.savingsBalance);

    if (state.isCcPaid) {
      creditBalanceEl.textContent = "₹0.00";
      creditBalanceEl.classList.remove("text-danger");
      creditBalanceEl.classList.add("text-success");
      dueDateLabel.textContent = "No Pending Dues";
      dueDateLabel.className = "stat-meta text-success";
      payCcBtn.classList.add("hidden");
    } else {
      creditBalanceEl.textContent = formatINR(state.creditCardDue);
      creditBalanceEl.classList.remove("text-success");
      dueDateLabel.textContent = "Due Date: 15 July 2026";
      payCcBtn.classList.remove("hidden");
    }

    // Render Transaction Log
    renderTransactionsTable();
  }

  function formatINR(amount) {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function renderTransactionsTable() {
    txTbody.innerHTML = "";

    state.transactions.forEach(tx => {
      const row = document.createElement("tr");

      // Format credit vs debit classes
      const amountClass = tx.type === "credit" ? "tx-amount-credit" : "tx-amount-debit";
      const amountPrefix = tx.type === "credit" ? "+" : "-";
      const badgeClass = tx.type === "credit" ? "badge-credit" : "badge-debit";

      row.innerHTML = `
        <td style="font-weight: 500; color: #475569;">${tx.date}</td>
        <td>${tx.desc}</td>
        <td><span class="badge ${badgeClass}">${tx.type}</span></td>
        <td class="${amountClass}">${amountPrefix}${formatINR(tx.amount)}</td>
        <td>
          <span class="status-indicator">
            <span class="status-dot"></span>
            ${tx.status}
          </span>
        </td>
      `;

      txTbody.appendChild(row);
    });
  }


  // --- 6. SIMULATED ACTIONS (PAY BILL & TRANSFER) ---
  // Pay Credit Card bill from Savings
  payCcBtn.addEventListener("click", () => {
    if (state.savingsBalance < state.creditCardDue) {
      alert("Insufficient funds in savings account to pay credit card bill.");
      return;
    }

    // Execute state deduction
    state.savingsBalance -= state.creditCardDue;
    state.isCcPaid = true;

    // Log new transaction
    state.transactions.unshift({
      date: "Today",
      desc: "Regalia Credit Card Outstanding Paid",
      type: "debit",
      amount: state.creditCardDue,
      status: "Success"
    });

    // Re-render
    renderDashboard();
    showQuickOperationToast("🎉 Regalia Credit Card Outstanding paid successfully!");
  });

  // Transfer funds form handler
  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const recipientName = beneficiaryNameInput.value.trim();
    const recipientAcc = beneficiaryAccInput.value.trim();
    const transferAmt = parseFloat(transferAmountInput.value);

    // Form warning reset
    transferMessageEl.classList.add("hidden");
    transferMessageEl.textContent = "";

    if (isNaN(transferAmt) || transferAmt <= 0) {
      alert("Please enter a valid amount to transfer.");
      return;
    }

    if (transferAmt > state.savingsBalance) {
      transferMessageEl.textContent = `Insufficient balance. Available is ${formatINR(state.savingsBalance)}`;
      transferMessageEl.className = "error-msg";
      transferMessageEl.classList.remove("hidden");
      return;
    }

    // Execute transfer deduction
    state.savingsBalance -= transferAmt;

    // Add entry to ledger
    state.transactions.unshift({
      date: "Today",
      desc: `Transfer to ${recipientName} (A/C: ${recipientAcc})`,
      type: "debit",
      amount: transferAmt,
      status: "Success"
    });

    // Clear Form inputs
    transferForm.reset();

    // Re-render
    renderDashboard();

    // Show beautiful success notification
    transferMessageEl.textContent = `✓ Successfully transferred ${formatINR(transferAmt)} to ${recipientName}!`;
    transferMessageEl.className = "info-msg";
    transferMessageEl.classList.remove("hidden");

    // Clear success message after 5 seconds
    setTimeout(() => {
      transferMessageEl.classList.add("hidden");
    }, 5000);
  });


  // --- 7. QUICK ACTION HANDLERS ---
  function showQuickOperationToast(msg) {
    operationToast.textContent = msg;
    operationToast.classList.remove("hidden");

    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      operationToast.classList.add("hidden");
    }, 4000);
  }

  actionStatement.addEventListener("click", () => {
    showQuickOperationToast("📄 Preparing certified e-Statement. Saving to Downloads folder...");
  });

  actionCards.addEventListener("click", () => {
    showQuickOperationToast("💳 Opened Card Management Center. Security limits verified.");
  });

  actionSupport.addEventListener("click", () => {
    showQuickOperationToast("📞 Connecting to HDFC Bank Secure Support Line (+1800-202-6161).");
  });

  actionProfile.addEventListener("click", () => {
    showQuickOperationToast("👤 Profile: ID: snehal, Name: Snehal Virendra Jadhav, Status: Fully KYC Verified.");
  });


  // --- 8. SESSION LOGOUT HANDLER ---
  logoutBtn.addEventListener("click", () => {
    // Reset State back to defaults so it plays like a real reusable site
    state.savingsBalance = 125000.00;
    state.creditCardDue = 8450.75;
    state.isCcPaid = false;
    state.transactions = [
      { date: "26 Jun 2026", desc: "Salary Credited - Corp Corp", type: "credit", amount: 45000.00, status: "Success" },
      { date: "25 Jun 2026", desc: "UPI Payment - Starbucks", type: "debit", amount: 1250.00, status: "Success" },
      { date: "22 Jun 2026", desc: "ATM Cash Withdrawal", type: "debit", amount: 5000.00, status: "Success" },
      { date: "20 Jun 2026", desc: "Electricity Bill Pay", type: "debit", amount: 2300.00, status: "Success" },
      { date: "18 Jun 2026", desc: "Cashback Reward Points Credited", type: "credit", amount: 150.00, status: "Success" }
    ];

    // Reset login inputs
    usernameInput.value = "";
    passwordInput.value = "";
    loginErrorMsg.classList.add("hidden");
    loginBtn.disabled = false;
    loginBtn.textContent = "Secure Login";

    // Transition back to login view
    dashboardContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  });
});
