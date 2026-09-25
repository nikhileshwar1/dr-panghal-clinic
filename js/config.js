/**
 * DR. PANGHAL HOMOEOPATHY & AESTHETIC CLINIC
 * Central Business & Tracking Configuration
 * 
 * Update these details easily without modifying HTML structure.
 */

const CLINIC_CONFIG = {
  // Business Identity
  clinicName: "Dr. Panghal Homoeopathic & Aesthetic Clinic",
  tagline: "Personalized Aesthetic Care. Professional Results.",
  
  // Confirmed Location & Verified Google Profile
  address: {
    line1: "2/A, Huda Park Rd, opposite CID Office",
    line2: "near Suncity Cinema, Patel Nagar",
    city: "Bhiwani",
    state: "Haryana",
    pincode: "127021",
    fullAddress: "2/A, Huda Park Rd, opposite CID Office, near Suncity Cinema, Patel Nagar, Bhiwani, Haryana 127021",
    // Verified Google Business Profile Share Link
    googleProfileUrl: "https://share.google/XEByVCQEFG2kxkohU",
    // Exact Destination Navigation URL
    googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Dr.+Panghal+Homoeopathic+%26+Aesthetic+Clinic%2C+2%2FA%2C+Huda+Park+Rd%2C+Opposite+CID+Office%2C+near+Suncity+Cinema%2C+Patel+Nagar%2C+Bhiwani%2C+Haryana+127021"
  },

  // Contact Details (Verified Clinic Numbers)
  contact: {
    displayPhone: "9896799718",
    callNumber: "9896799718",
    whatsappNumber: "919896799718",
    whatsappDefaultMessage: "Hi, I would like to book a no-cost aesthetic consultation at Dr. Panghal Clinic."
  },

  // Google Sheets Lead Webhook Endpoint (Google Apps Script)
  googleSheetsEndpoint: "https://script.google.com/macros/s/AKfycbyxHKL4KIEr1s6EBE5tNvspmwwqs0K8bn4nXGAqixhCaDkcIzdzlMBWb-hnIRIkG9tv/exec",

  // Operating Hours
  hours: {
    weekdays: "Monday – Saturday: 9:00 AM – 4:00 PM",
    sunday: "Sunday: Closed"
  },

  // Verified Proof Metrics (Strictly non-exaggerated)
  proof: {
    googleRating: "4.9",
    totalReviews: "50+",
    consultationOffer: "No-Cost Aesthetic Consultation"
  },

  // Tracking & Analytics Configuration (Replace with actual IDs when ready)
  tracking: {
    metaPixelId: "YOUR_META_PIXEL_ID", // e.g. "123456789012345"
    googleAnalyticsId: "G-XXXXXXXXXX",   // e.g. "G-A1B2C3D4E5"
    enableConsoleDebug: true            // Prints tracking events in browser console
  },

  // Treatment Options for Appointment Form
  treatmentOptions: [
    { value: "laser_hair_removal", label: "Laser Hair Removal (Priority)" },
    { value: "skin_glow", label: "Skin Glow & Brightening" },
    { value: "hydrafacial", label: "Hydrafacial Treatment" },
    { value: "carbon_laser_peel", label: "Carbon Laser Peel" },
    { value: "acne_scars", label: "Acne & Acne Scar Care" },
    { value: "hair_treatments", label: "Hair & Hair-Fall Care (PRP)" },
    { value: "warts_skin_tags", label: "Warts & Skin Tag Removal" },
    { value: "anti_aging", label: "Skin Rejuvenation & Texture" },
    { value: "not_sure", label: "Not Sure / Need Guidance" }
  ]
};

// Export for global browser window usage
if (typeof window !== "undefined") {
  window.CLINIC_CONFIG = CLINIC_CONFIG;
}
