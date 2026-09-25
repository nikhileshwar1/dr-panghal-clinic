/**
 * DR. PANGHAL HOMOEOPATHY & AESTHETIC CLINIC — APPLICATION LOGIC
 * Features:
 * - Central Config Injection
 * - UTM Parameter Capture & Persistence
 * - Meta Pixel Standard Events (PageView, ViewContent, Contact, Lead)
 * - Accordion FAQ Interaction
 * - Appointment Form Validation & Lead Storage
 * - Modal & Mobile Conversion Bar Controls
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. UTM PARAMETER CAPTURE & STORAGE
  const captureUTMParameters = () => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const utmData = {};

    let hasUtm = false;
    utmKeys.forEach(key => {
      const val = params.get(key);
      if (val) {
        utmData[key] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      sessionStorage.setItem("clinic_utm_data", JSON.stringify(utmData));
    }

    return utmData;
  };

  const getStoredUTMs = () => {
    try {
      const stored = sessionStorage.getItem("clinic_utm_data");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const activeUTMs = { ...getStoredUTMs(), ...captureUTMParameters() };

  // 2. META PIXEL / ANALYTICS TRACKING HELPER
  const trackEvent = (eventName, params = {}) => {
    const config = window.CLINIC_CONFIG || {};
    
    // Log to console for transparency / debugging
    if (config.tracking && config.tracking.enableConsoleDebug) {
      console.log(`[Tracking Event] ${eventName}:`, { ...params, utm: activeUTMs });
    }

    // Official Meta Pixel dispatch if loaded
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, params);
    }

    // Google Analytics 4 dispatch if loaded
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  };

  // Fire initial PageView
  trackEvent("PageView", { page_title: document.title });

  // 3. INJECT CONFIG DATA INTO DOM
  const setupConfigLinks = () => {
    const config = window.CLINIC_CONFIG;
    if (!config) return;

    // Contact Phone Elements
    const phoneLinks = document.querySelectorAll(".clinic-phone-link");
    phoneLinks.forEach(link => {
      link.href = `tel:${config.contact.callNumber}`;
      link.addEventListener("click", () => {
        trackEvent("Contact", { method: "phone_call", location: link.dataset.location || "unknown" });
      });
    });

    const phoneTexts = document.querySelectorAll(".clinic-phone-text");
    phoneTexts.forEach(el => {
      el.textContent = config.contact.displayPhone;
    });

    // WhatsApp Elements
    const waLinks = document.querySelectorAll(".clinic-wa-link");
    waLinks.forEach(link => {
      let message = config.contact.whatsappDefaultMessage;
      if (activeUTMs.utm_campaign) {
        message += ` (Ref: ${activeUTMs.utm_campaign})`;
      }
      const waUrl = `https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
      link.href = waUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      link.addEventListener("click", () => {
        trackEvent("Contact", { method: "whatsapp", location: link.dataset.location || "unknown" });
      });
    });

    // Google Maps Directions
    const mapLinks = document.querySelectorAll(".clinic-map-link");
    mapLinks.forEach(link => {
      link.href = config.address.googleMapsDirectionsUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    // Populate Treatment Select Dropdowns
    const treatmentSelects = document.querySelectorAll(".treatment-dropdown");
    treatmentSelects.forEach(select => {
      // Clear existing options except placeholder
      select.innerHTML = `<option value="" disabled selected>Select Your Primary Concern / Treatment</option>`;
      config.treatmentOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });
    });
  };

  setupConfigLinks();

  // 4. VIEWCONTENT TRACKING ON SCROLL
  const observeTreatmentsSection = () => {
    const target = document.getElementById("treatments");
    if (!target) return;

    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          trackEvent("ViewContent", { content_category: "Aesthetic Treatments", content_name: "Services Section" });
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(target);
  };

  observeTreatmentsSection();

  // 5. FAQ ACCORDION
  const setupAccordion = () => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
      const btn = item.querySelector(".faq-button");
      const answer = item.querySelector(".faq-answer");

      if (!btn || !answer) return;

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Close other items for neat presentation
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            other.querySelector(".faq-button").setAttribute("aria-expanded", "false");
            other.querySelector(".faq-answer").style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + 32 + "px";
        }
      });
    });
  };

  setupAccordion();

  // 6. MODAL APPOINTMENT POPUP LOGIC
  const modal = document.getElementById("bookingModal");
  const modalTriggers = document.querySelectorAll(".trigger-booking-modal");
  const modalClose = document.getElementById("closeModalBtn");

  const openModal = (preselectedTreatment = null) => {
    if (!modal) return;
    modal.classList.add("is-visible");
    document.body.style.overflow = "hidden";

    if (preselectedTreatment) {
      const select = modal.querySelector(".treatment-dropdown");
      if (select) {
        select.value = preselectedTreatment;
      }
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-visible");
    document.body.style.overflow = "";
  };

  modalTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const treatmentVal = btn.dataset.treatment || null;
      openModal(treatmentVal);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-visible")) {
        closeModal();
      }
    });
  }

  // 7. APPOINTMENT FORM SUBMISSION & VALIDATION
  const setupFormSubmission = (formId, successBoxId) => {
    const form = document.getElementById(formId);
    const successBox = document.getElementById(successBoxId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="patient_name"]');
      const phoneInput = form.querySelector('input[name="patient_phone"]');
      const treatmentInput = form.querySelector('select[name="treatment_interest"]');
      const dateInput = form.querySelector('input[name="preferred_date"]');
      const timeInput = form.querySelector('select[name="preferred_time"]');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add("error");
        isValid = false;
      } else {
        nameInput.classList.remove("error");
      }

      // Validate Phone (Accepts 10-digit Indian numbers, optional +91 or 0 prefix)
      const cleanPhone = phoneInput.value.replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        phoneInput.classList.add("error");
        isValid = false;
      } else {
        phoneInput.classList.remove("error");
      }

      // Validate Treatment
      if (!treatmentInput.value) {
        treatmentInput.classList.add("error");
        isValid = false;
      } else {
        treatmentInput.classList.remove("error");
      }

      if (!isValid) {
        alert("Please provide your name, valid phone number, and area of concern.");
        return;
      }

      // Prepare Lead Data
      const leadPayload = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        treatment: treatmentInput.value,
        preferredDate: dateInput ? dateInput.value : "Not specified",
        preferredTime: timeInput ? timeInput.value : "Anytime",
        submittedAt: new Date().toISOString(),
        location: "Bhiwani Clinic",
        source: "Landing Page",
        utm: activeUTMs
      };

      // Store in local storage for clinic reception staff review
      try {
        const storedLeads = JSON.parse(localStorage.getItem("dr_panghal_leads") || "[]");
        storedLeads.unshift(leadPayload);
        localStorage.setItem("dr_panghal_leads", JSON.stringify(storedLeads));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }

      // Track Meta Pixel Lead Event (Crucial for ad conversion optimization)
      trackEvent("Lead", {
        content_name: leadPayload.treatment,
        status: "Consultation Requested",
        currency: "INR",
        value: 0.00
      });

      // Show confirmation state
      form.style.display = "none";
      if (successBox) {
        successBox.style.display = "block";
      }
    });
  };

  // Setup inline booking form & modal booking form
  setupFormSubmission("inlineBookingForm", "inlineSuccessBox");
  setupFormSubmission("modalBookingForm", "modalSuccessBox");

  // 8. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile drawer when clicking a navigation link
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
