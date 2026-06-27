/**
 * HDFC NetBanking - Premium Demo Application Engine
 * Core Vanilla JavaScript logic for simulated banking actions, state updates,
 * interactive calculations, responsive menu structures, and robust login loops.
 */

// --- 1. CORE BANKING STATE (SIMULATED ENGINE) ---
let state = {
  user: "Demo User",
  savingsBalance: 125000.00,
  creditCardDue: 8450.75,
  fdBalance: 75000.00,
  rewardPoints: 2340,
  isCcPaid: false,
  transactions: [
    { date: "26 Jun 2026", desc: "Salary Credited", ref: "Ref: SAL-CORP-98124", type: "credit", amount: 45000.00, status: "Success" },
    { date: "25 Jun 2026", desc: "UPI Payment - Starbucks", ref: "UPI Ref: 610398240912", type: "debit", amount: 1250.00, status: "Success" },
    { date: "22 Jun 2026", desc: "ATM Withdrawal", ref: "Card: XX3940 Fort Branch", type: "debit", amount: 5000.00, status: "Success" },
    { date: "20 Jun 2026", desc: "Electricity Bill", ref: "Ref: BILL-MSEB-4091", type: "debit", amount: 2300.00, status: "Success" },
    { date: "18 Jun 2026", desc: "Cashback - Regalia Gold", ref: "Ref: CB-HDFC-REG-552", type: "credit", amount: 150.00, status: "Success" }
  ]
};

// --- 2. DOM SELECTOR DEFINITIONS ---
document.addEventListener("DOMContentLoaded", () => {
  
  // Login DOM Elements
  const loginForm = document.getElementById("login-form");
  const customerIdInput = document.getElementById("customer-id");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("toggle-password-btn");
  const eyeIcon = document.getElementById("eye-icon");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const loginErrorAlert = document.getElementById("login-error-alert");
  const loginErrorMessage = document.getElementById("login-error-message");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  
  // Dashboard Core Elements
  const sidebarDrawer = document.getElementById("sidebar-drawer");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const transactionSearch = document.getElementById("transaction-search");
  const txTableBody = document.getElementById("tx-table-body");
  const noTxResults = document.getElementById("no-tx-results");
  const liveTimeText = document.getElementById("live-time-text");
  
  // Profile dropdown elements
  const profileMenuTrigger = document.getElementById("profile-menu-trigger");
  const profileDropdownMenu = document.getElementById("profile-dropdown-menu");
  const notificationTrigger = document.getElementById("notification-trigger");

  // Dynamic Dashboard Stats fields
  const savingsBalanceField = document.getElementById("savings-balance");
  const creditCardDueField = document.querySelector(".overview-card.danger-card .balance-display .amount-value");
  const creditCardStatusBadge = document.querySelector(".overview-card.danger-card .card-status-badge");
  const creditCardButton = document.querySelector(".overview-card.danger-card .action-btn.primary");
  const fdBalanceField = document.getElementById("fd-balance");
  const rewardPointsField = document.querySelector(".overview-card.reward-card .balance-display .amount-value");

  // Interactive forms and tools
  const transferForm = document.getElementById("transfer-form-demo");
  const fdCalcForm = document.getElementById("fd-calc-form");
  const fdAmountInput = document.getElementById("fd-amount-input");
  const fdTenureSelect = document.getElementById("fd-tenure");
  const interestEarnedCalc = document.getElementById("interest-earned-calc");
  const maturitySumCalc = document.getElementById("maturity-sum-calc");

  // Modal dialog elements
  const serviceModal = document.getElementById("service-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalDecor = document.getElementById("modal-decor");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalPrimaryBtn = document.getElementById("modal-primary-btn");


  // --- 3. INITIALIZATION AND COOKIES/LOCAL STORAGE ---
  // Load saved User ID if "Remember Me" was checked previously
  const savedUserId = localStorage.getItem("hdfc_demo_remembered_user");
  if (savedUserId) {
    customerIdInput.value = savedUserId;
    rememberMeCheckbox.checked = true;
  }

  // Set default historical last login string dynamically
  const lastLoginField = document.getElementById("last-login-time");
  if (lastLoginField) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(yesterday.getHours() - 1);
    lastLoginField.textContent = yesterday.toLocaleDateString("en-US", options);
  }


  // --- 4. LIVE DIGITAL CLOCK ---
  function updateLiveClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    if (liveTimeText) {
      liveTimeText.textContent = timeString;
    }
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();


  // --- 5. PASSWORD VISIBILITY TOGGLER ---
  togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.innerHTML = `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>`;
    } else {
      passwordInput.type = "password";
      eyeIcon.innerHTML = `<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/>`;
    }
  });


  // --- 6. AUTOFILL DEMO CREDENTIALS REMOVED ---


  // --- 7. SECURE LOGIN SUBMISSION LOOP ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const customerId = customerIdInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Clear previous warnings
    loginErrorAlert.classList.add("hidden");

    // Validation 1: Empty Fields
    if (!customerId || !password) {
      showLoginError("Both Customer ID and NetBanking IPIN are mandatory.");
      return;
    }

    // Enter Simulated Loading State
    setLoginLoading(true);

    setTimeout(() => {
      // Validation 2: Check Credentials
      if (customerId === "demo" && password === "demo123") {
        
        // Remember User ID logic
        if (rememberMeCheckbox.checked) {
          localStorage.setItem("hdfc_demo_remembered_user", customerId);
        } else {
          localStorage.removeItem("hdfc_demo_remembered_user");
        }

        // Successfully authenticated!
        setLoginLoading(false);
        transitionToDashboard();
        
      } else {
        setLoginLoading(false);
        showLoginError("Invalid User ID or Password. Please try again.");
      }
    }, 1200); // Realistic network delay for authorization check
  });

  function showLoginError(msg) {
    loginErrorMessage.textContent = msg;
    loginErrorAlert.classList.remove("hidden");
  }

  function setLoginLoading(isLoading) {
    const btnText = loginSubmitBtn.querySelector(".btn-text");
    const spinner = loginSubmitBtn.querySelector(".spinner");
    
    if (isLoading) {
      loginSubmitBtn.disabled = true;
      btnText.textContent = "VERIFYING CREDENTIALS...";
      spinner.classList.remove("hidden");
    } else {
      loginSubmitBtn.disabled = false;
      btnText.textContent = "SECURE LOGIN";
      spinner.classList.add("hidden");
    }
  }


  // --- 8. TRANSITION ENGINE (LOGIN -> DASHBOARD) ---
  function transitionToDashboard() {
    // Add custom sliding fade-out to login screen
    loginView.style.opacity = "0";
    loginView.style.transform = "translateY(-15px)";
    
    setTimeout(() => {
      loginView.classList.remove("active-view");
      
      // Update UI with initial state values before presenting dashboard
      refreshDashboardData();
      
      // Render the dashboard
      dashboardView.classList.add("active-view");
      // Small delay to trigger the opacity transform CSS rules
      setTimeout(() => {
        dashboardView.style.opacity = "1";
        dashboardView.style.transform = "translateY(0)";
      }, 50);

      // Trigger automatic welcome notification
      showToastNotification("Dynamic Login Alert", "Welcome back, Demo User! Secure session initiated over 256-bit TLS.");
    }, 400);
  }

  // Backwards logout logic
  const logoutButtons = document.querySelectorAll(".logout-action-btn");
  logoutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Confirm before logging out
      openModal("Confirm Sign Out", "Are you sure you want to log out from this NetBanking session? Unsaved transactions will be discarded.", true, () => {
        executeLogout();
      });
    });
  });

  function executeLogout() {
    dashboardView.style.opacity = "0";
    dashboardView.style.transform = "translateY(15px)";
    
    setTimeout(() => {
      dashboardView.classList.remove("active-view");
      
      // Clear password field for safety
      passwordInput.value = "";
      
      loginView.classList.add("active-view");
      setTimeout(() => {
        loginView.style.opacity = "1";
        loginView.style.transform = "translateY(0)";
      }, 50);
    }, 400);
  }


  // --- 9. MOBILE SIDEBAR DRAWER CONTROLLER ---
  sidebarToggleBtn.addEventListener("click", () => {
    sidebarDrawer.classList.add("open");
    sidebarOverlay.classList.add("show");
  });

  function closeMobileSidebar() {
    sidebarDrawer.classList.remove("open");
    sidebarOverlay.classList.remove("show");
  }

  sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  sidebarOverlay.addEventListener("click", closeMobileSidebar);


  // --- 10. SIDEBAR TAB-CONTENT SYSTEM ---
  const menuItems = document.querySelectorAll(".menu-item");
  const tabContents = document.querySelectorAll(".tab-content");

  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabTarget = item.getAttribute("data-tab");
      
      if (!tabTarget) return;

      // Update active sidebar item
      menuItems.forEach(mi => mi.classList.remove("active"));
      item.classList.add("active");

      // Switch displayed subtab content panel
      tabContents.forEach(tc => tc.classList.remove("active-tab-content"));
      const activeContentPanel = document.getElementById(`tab-content-${tabTarget}`);
      if (activeContentPanel) {
        activeContentPanel.classList.add("active-tab-content");
      }

      // Sync user dropdown selection or breadcrumb state
      const breadcrumbText = document.querySelector(".breadcrumb-current");
      if (breadcrumbText) {
        breadcrumbText.textContent = item.querySelector("span").textContent;
      }

      // Close mobile drawer automatically on select
      closeMobileSidebar();
    });
  });

  // Connect Quick Action Grid cards to Tab Content targets
  const quickActButtons = document.querySelectorAll(".quick-act-action");
  quickActButtons.forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const actionName = card.getAttribute("data-action");
      handleQuickAction(actionName);
    });
  });

  function handleQuickAction(actionName) {
    if (actionName === "View Account") {
      switchTab("accounts");
    } else if (actionName === "Fund Transfer") {
      switchTab("transfers");
    } else if (actionName === "Credit Card" || actionName === "Card Statement") {
      switchTab("cards");
    } else if (actionName === "Loan Offers" || actionName === "Disburse Personal Loan" || actionName === "Request Car Loan") {
      switchTab("loans");
    } else if (actionName === "Fixed Deposit" || actionName === "Open Fixed Deposit") {
      switchTab("deposits");
    } else if (actionName === "Statements" || actionName.startsWith("Download")) {
      switchTab("statements");
      if (actionName.startsWith("Download")) {
        triggerSimulatedDownload(actionName);
      }
    } else if (actionName === "Profile" || actionName === "Edit Contact Details") {
      switchTab("profile");
    } else if (actionName === "Support" || actionName === "Start Chat with Eva" || actionName === "Call Support Desk") {
      switchTab("support");
      if (actionName === "Start Chat with Eva") {
        openModal("Eva Chat Assistant", "Simulating Chat Session... Hello! I am Eva, HDFC's digital banking assistant. How can I assist you with your accounts today?", false);
      } else if (actionName === "Call Support Desk") {
        openModal("Support Hotlines", "HDFC Bank Secure Helpline numbers:<br><strong>Toll Free: 1800 202 6161 / 1800 22 1006</strong><br>Email Support: netbanking.support@hdfcbank-demo.co.in", false);
      }
    } else if (actionName === "Pay Card Bill") {
      triggerPayCreditCardBill();
    } else if (actionName === "Redeem Rewards") {
      openModal("Reward Points Redemption", "You currently have <strong>2,340</strong> active Regalia points worth <strong>₹2,340.00</strong>. Would you like to redeem them for flight bookings or products?", true, () => {
        openModal("Redemption Successful", "Simulated Reward Voucher of ₹2,000 emailed to registered customer address. Points balance remains 340.", false);
        state.rewardPoints = 340;
        refreshDashboardData();
      });
    } else {
      openModal("Action Initiated", `Interactive simulation for <strong>"${actionName}"</strong> launched. This feature is fully prepared as a high-fidelity visual mock.`, false);
    }
  }

  function switchTab(tabId) {
    const targetSidebarItem = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
    if (targetSidebarItem) {
      targetSidebarItem.click();
    }
  }


  // --- 11. REFRESH & INJECT DASHBOARD DATA ---
  function refreshDashboardData() {
    savingsBalanceField.textContent = formatCurrency(state.savingsBalance);
    fdBalanceField.textContent = formatCurrency(state.fdBalance);
    rewardPointsField.textContent = state.rewardPoints.toLocaleString();

    // Check Credit Card Bill paid status
    if (state.isCcPaid) {
      creditCardDueField.textContent = "0";
      creditCardDueField.closest(".balance-display").classList.remove("color-red");
      creditCardDueField.closest(".balance-display").classList.add("color-green");
      creditCardStatusBadge.textContent = "Settled";
      creditCardStatusBadge.className = "card-status-badge status-green";
      creditCardButton.disabled = true;
      creditCardButton.textContent = "No Dues Pending";
      creditCardButton.style.opacity = "0.6";
      creditCardButton.style.cursor = "default";
    } else {
      creditCardDueField.textContent = formatCurrency(state.creditCardDue);
    }

    // Refresh transaction logs on UI
    renderTransactionTable();
  }

  function formatCurrency(amount) {
    return amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function renderTransactionTable(filterText = "") {
    txTableBody.innerHTML = "";
    const cleanFilter = filterText.toLowerCase().trim();
    let hasRows = false;

    state.transactions.forEach(tx => {
      const isMatch = tx.desc.toLowerCase().includes(cleanFilter) || 
                      tx.ref.toLowerCase().includes(cleanFilter) || 
                      tx.type.toLowerCase().includes(cleanFilter);
      
      if (!isMatch) return;

      hasRows = true;
      const amountSign = tx.type === "credit" ? "+" : "-";
      const amountClass = tx.type === "credit" ? "tx-credit-amount" : "tx-debit-amount";
      const badgeClass = tx.type === "credit" ? "tx-credit" : "tx-debit";

      const tr = document.createElement("tr");
      tr.className = "tx-row";
      tr.innerHTML = `
        <td class="font-mono">${tx.date}</td>
        <td>
          <div class="narration-cell">
            <span class="narration-title">${tx.desc}</span>
            <span class="narration-sub">${tx.ref}</span>
          </div>
        </td>
        <td><span class="badge ${badgeClass}">${tx.type}</span></td>
        <td class="font-space ${amountClass}">${amountSign}₹${tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td>
          <span class="status-badge-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="badge-icon-svg"><polyline points="20 6 9 17 4 12"/></svg>
            ${tx.status}
          </span>
        </td>
      `;
      txTableBody.appendChild(tr);
    });

    if (hasRows) {
      noTxResults.classList.add("hidden");
    } else {
      noTxResults.classList.remove("hidden");
    }
  }


  // --- 12. INSTANT TRANSACTION TABLE SEARCH FILTER ---
  transactionSearch.addEventListener("input", (e) => {
    renderTransactionTable(e.target.value);
  });


  // --- 13. USER DROPDOWN PROFILE MENU ---
  profileMenuTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdownMenu.classList.toggle("show");
    
    // Rotate the chevron on open
    const chevron = profileMenuTrigger.querySelector(".dropdown-chevron");
    if (profileDropdownMenu.classList.contains("show")) {
      chevron.style.transform = "rotate(180deg)";
    } else {
      chevron.style.transform = "rotate(0deg)";
    }
  });

  // Close profile dropdown if clicked outside
  window.addEventListener("click", () => {
    if (profileDropdownMenu.classList.contains("show")) {
      profileDropdownMenu.classList.remove("show");
      profileMenuTrigger.querySelector(".dropdown-chevron").style.transform = "rotate(0deg)";
    }
  });


  // --- 14. INTERACTIVE MODAL OVERLAY MANAGER ---
  let pendingModalConfirmCallback = null;

  function openModal(title, msg, showConfirm = false, onConfirm = null) {
    modalTitle.innerHTML = title;
    modalMessage.innerHTML = msg;
    modalDecor.classList.add("hidden");
    
    pendingModalConfirmCallback = onConfirm;

    if (showConfirm) {
      modalPrimaryBtn.textContent = "Confirm Action";
      modalPrimaryBtn.style.backgroundColor = "var(--hdfc-red)";
    } else {
      modalPrimaryBtn.textContent = "Acknowledge";
      modalPrimaryBtn.style.backgroundColor = "var(--hdfc-blue)";
    }

    serviceModal.classList.add("show");
  }

  function closeModal() {
    serviceModal.classList.remove("show");
    pendingModalConfirmCallback = null;
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalPrimaryBtn.addEventListener("click", () => {
    if (pendingModalConfirmCallback) {
      const cb = pendingModalConfirmCallback;
      closeModal();
      cb();
    } else {
      closeModal();
    }
  });


  // --- 15. TOAST NOTIFICATION UTILITY ---
  function showToastNotification(title, message) {
    // Generate simple elegant alert banner in corner
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = "var(--neutral-dark)";
    toast.style.color = "var(--neutral-light)";
    toast.style.padding = "16px 20px";
    toast.style.borderRadius = "var(--radius-md)";
    toast.style.boxShadow = "var(--shadow-lg)";
    toast.style.zIndex = "2000";
    toast.style.maxWidth = "350px";
    toast.style.display = "flex";
    toast.style.gap = "12px";
    toast.style.alignItems = "flex-start";
    toast.style.borderLeft = "5px solid var(--hdfc-blue)";
    toast.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    toast.style.transform = "translateY(50px)";
    toast.style.opacity = "0";

    toast.innerHTML = `
      <div style="flex-shrink:0; color:var(--success-green); margin-top: 2px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div>
        <h4 style="font-size:13.5px; font-weight:700; margin-bottom:2px; letter-spacing:0.2px;">${title}</h4>
        <p style="font-size:12px; color:rgba(255,255,255,0.75); line-height:1.4;">${message}</p>
      </div>
    `;

    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    }, 100);

    // Fade out automatically
    setTimeout(() => {
      toast.style.transform = "translateY(20px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 6000);
  }


  // --- 16. SIMULATION: TRANSFER FUNDS ACTION ---
  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("transfer-name").value.trim();
    const destAcct = document.getElementById("transfer-acc").value.trim();
    const amount = parseFloat(document.getElementById("transfer-amount").value);
    const remarks = document.getElementById("transfer-remarks").value.trim() || "Funds Transfer";

    if (!name || !destAcct || isNaN(amount) || amount <= 0) {
      openModal("Validation Failure", "Please enter correct recipient, transfer accounts, and amount greater than zero.", false);
      return;
    }

    if (amount > state.savingsBalance) {
      openModal("Insufficient Balance", `Transfer failed. Your Savings Account balance is <strong>₹${state.savingsBalance.toLocaleString("en-IN")}</strong> which is less than your requested transfer amount <strong>₹${amount.toLocaleString("en-IN")}</strong>.`, false);
      return;
    }

    // Step 1: Open dialog explaining a mock OTP was sent
    const formattedAmt = amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });
    const otpPromptHtml = `
      <p style="margin-bottom:12px;">A demo verification code has been dispatched to your registered mobile number: <strong>+91 ******123</strong>.</p>
      <div style="background-color: var(--neutral-bg); padding:14px; border-radius:var(--radius-md); border:1.5px solid var(--neutral-border); text-align:center; margin-bottom:14px;">
        <p style="font-size:11.5px; text-transform:uppercase; font-weight:700; color:var(--neutral-muted); margin-bottom:6px;">Simulated OTP Verification</p>
        <input type="text" id="demo-transfer-otp" placeholder="Enter OTP (demo: 123456)" class="form-text-input" style="max-width:200px; text-align:center; letter-spacing:2px; font-weight:700; font-size:16px;" value="123456">
      </div>
      <p style="font-size:12px; color:var(--neutral-muted);">Confirming this action will update simulated ledger states and deduct balances immediately.</p>
    `;

    openModal(`Confirm Transfer: ${formattedAmt}`, otpPromptHtml, true, () => {
      const otpInput = document.getElementById("demo-transfer-otp");
      const otpVal = otpInput ? otpInput.value.trim() : "";

      if (otpVal === "123456") {
        // Successful Simulated Transfer!
        state.savingsBalance -= amount;
        
        // Seed Transaction table
        const newTx = {
          date: "Today",
          desc: `Transferred to ${name}`,
          ref: `Ref: IMPS-${Math.floor(Math.random() * 899999 + 100000)} - Rem: ${remarks}`,
          type: "debit",
          amount: amount,
          status: "Success"
        };
        state.transactions.unshift(newTx);
        
        // Refresh dashboard statistics
        refreshDashboardData();

        // Switch to account tab to display updated details
        switchTab("accounts");

        // Present dynamic success animation modal
        setTimeout(() => {
          modalTitle.textContent = "Funds Dispatched Successfully";
          modalMessage.innerHTML = `Simulated transfer of <strong>₹${amount.toLocaleString("en-IN")}</strong> to <strong>${name}</strong> has been processed successfully. Your updated Savings balance is <strong>₹${state.savingsBalance.toLocaleString("en-IN")}</strong>.`;
          modalDecor.classList.remove("hidden");
          modalPrimaryBtn.textContent = "Acknowledge";
          modalPrimaryBtn.style.backgroundColor = "var(--hdfc-blue)";
          serviceModal.classList.add("show");
        }, 200);

        // Reset the form fields
        transferForm.reset();
      } else {
        openModal("Authentication Fault", "Invalid OTP entered. Simulated transfer aborted. Please try again with code '123456'.", false);
      }
    });
  });


  // --- 17. SIMULATION: PAY CREDIT CARD BILL ---
  function triggerPayCreditCardBill() {
    if (state.creditCardDue <= 0) {
      openModal("No Pending Dues", "Your Regalia Credit Card balance is already paid. There are no outstanding bills due.", false);
      return;
    }

    if (state.savingsBalance < state.creditCardDue) {
      openModal("Insufficient Funds", "Your Savings Account balance is lower than the Credit Card due. Please transfer funds first.", false);
      return;
    }

    const formattedCcDue = state.creditCardDue.toLocaleString("en-IN", { style: "currency", currency: "INR" });
    openModal("Settle Credit Card Due", `Are you sure you want to transfer <strong>${formattedCcDue}</strong> from your Savings Account to clear your credit card dues? This action will instantly settle the Regalia Gold Card outstanding.`, true, () => {
      // Deduct from savings balance
      state.savingsBalance -= state.creditCardDue;
      state.isCcPaid = true;

      // Seed Transaction logs
      const newTx = {
        date: "Today",
        desc: "Credit Card Settle - HDFC Regalia",
        ref: "CC Pay Ref: CC-PYMT-09281A",
        type: "debit",
        amount: state.creditCardDue,
        status: "Success"
      };
      state.transactions.unshift(newTx);

      // Refresh stats
      refreshDashboardData();

      // Show success toaster notification
      showToastNotification("Dues Paid Successfully", `Your HDFC Regalia outstanding of ${formattedCcDue} has been cleared.`);
    });
  }


  // --- 18. SIMULATION: BOOK FIXED DEPOSIT WITH CALCULATOR ---
  function updateFdCalculator() {
    const principal = parseFloat(fdAmountInput.value) || 0;
    const tenureYears = parseInt(fdTenureSelect.value) || 1;
    
    let rate = 6.50;
    if (tenureYears === 2 || tenureYears === 3) {
      rate = 7.10;
    } else if (tenureYears === 5) {
      rate = 7.00;
    }

    const interest = principal * (rate / 100) * tenureYears;
    const maturityVal = principal + interest;

    interestEarnedCalc.textContent = `₹${interest.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    maturitySumCalc.textContent = `₹${maturityVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (fdAmountInput && fdTenureSelect) {
    fdAmountInput.addEventListener("input", updateFdCalculator);
    fdTenureSelect.addEventListener("change", updateFdCalculator);
    updateFdCalculator();
  }

  if (fdCalcForm) {
    fdCalcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const principal = parseFloat(fdAmountInput.value) || 0;
      if (principal < 10000) {
        openModal("Lower Limit Warning", "Minimum booking principal amount for simulated digital FDs is ₹10,000.", false);
        return;
      }

      if (principal > state.savingsBalance) {
        openModal("Insufficient Savings", "You do not have enough funds in your savings balance to complete this Fixed Deposit booking.", false);
        return;
      }

      const tenureText = fdTenureSelect.options[fdTenureSelect.selectedIndex].text;
      openModal("Book Fixed Deposit", `Confirm transferring <strong>₹${principal.toLocaleString("en-IN")}</strong> from your Savings Account to lock in a new Fixed Deposit for a term of <strong>${tenureText}</strong>?`, true, () => {
        // Settle state
        state.savingsBalance -= principal;
        state.fdBalance += principal;

        // Transaction log addition
        const newTx = {
          date: "Today",
          desc: "Fixed Deposit Booked",
          ref: `FD Account Created: FD-NEW-${Math.floor(Math.random() * 89999 + 10000)}`,
          type: "debit",
          amount: principal,
          status: "Success"
        };
        state.transactions.unshift(newTx);

        // Refresh stats
        refreshDashboardData();
        switchTab("accounts");

        // Success dialog
        setTimeout(() => {
          openModal("Fixed Deposit Active", `Congratulations! Your simulated high-yield Fixed Deposit is booked. Balance has been debited and your asset balance has grown to <strong>₹${state.fdBalance.toLocaleString("en-IN")}</strong>.`, false);
        }, 200);
      });
    });
  }


  // --- 19. SIMULATION: DOWNLOAD e-STATEMENTS ---
  function triggerSimulatedDownload(actionName) {
    openModal("Preparing Certified Document", "Connecting to HDFC Bank secure document servers. Your digital e-Statement is being processed...", false);
    
    // Simulate compilation delay then start file download or success callback
    setTimeout(() => {
      modalTitle.textContent = "Document Ready";
      modalMessage.innerHTML = `Your authentic <strong>e-Statement</strong> has been generated successfully.<br><br><span style="color:#059669; font-weight:600;">✓ Certification verified (e-Signed HDFC Bank digital authority)</span>. This demo simulates file retrieval successfully.`;
      modalPrimaryBtn.textContent = "Save/Close";
    }, 1500);
  }

  // --- 20. BELL NOTIFICATIONS CLICKS ---
  notificationTrigger.addEventListener("click", () => {
    const alertsHtml = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="background-color:#edf2ff; border-left:4.5px solid var(--hdfc-blue); padding:10px; border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
          <h4 style="font-size:12.5px; font-weight:700; color:var(--hdfc-blue); margin-bottom:2px;">Salary Credited</h4>
          <p style="font-size:11px; color:var(--neutral-slate);">Salary payout of ₹45,000 has been credited on 26 Jun 2026. Secure SMS dispatched.</p>
        </div>
        <div style="background-color:#fffbeb; border-left:4.5px solid var(--warning-orange); padding:10px; border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
          <h4 style="font-size:12.5px; font-weight:700; color:#d97706; margin-bottom:2px;">Regalia Credit Card Bill Due</h4>
          <p style="font-size:11px; color:var(--neutral-slate);">Your minimum payment of ₹8,450.75 is due on 12 Jul 2026. Clear your dues directly to avoid charges.</p>
        </div>
      </div>
    `;
    openModal("NetBanking Notifications", alertsHtml, false);
    // Wiping notifications badge count on click
    const countBadge = notificationTrigger.querySelector(".notification-count");
    if (countBadge) {
      countBadge.remove();
    }
  });

});
