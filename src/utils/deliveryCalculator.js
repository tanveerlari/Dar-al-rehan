// Smart Courier Zone Delivery Calculator based on Indian Postal Pincodes (PIN)
// Accurately reflects standard courier slab rates (Delhivery, BlueDart, DTDC, Shiprocket)

export function getDeliveryDetails(pincode) {
  const cleanPin = String(pincode || "").trim().replace(/\D/g, "");

  if (cleanPin.length !== 6) {
    return {
      charge: 60,
      zone: "Standard India",
      state: "India",
      days: "4-6 Business Days",
      isEstimated: true,
    };
  }

  const prefix2 = parseInt(cleanPin.slice(0, 2), 10);
  const prefix3 = parseInt(cleanPin.slice(0, 3), 10);

  // 1. Remote / Special Hill & Island Zones
  if (
    (prefix2 >= 78 && prefix2 <= 79) || // Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal
    prefix2 === 19 || // Jammu & Kashmir, Ladakh
    prefix2 === 17 || // Himachal Pradesh
    prefix3 === 744 || // Andaman & Nicobar
    prefix3 === 682 // Lakshadweep
  ) {
    return {
      charge: 110,
      zone: "Special / Remote Zone",
      state: prefix2 >= 78 ? "North East" : prefix2 === 19 ? "J&K / Ladakh" : "Special Zone",
      days: "6-8 Business Days",
      isEstimated: false,
    };
  }

  // 2. Intra-State / Origin Region (Maharashtra & Goa - 40 to 44)
  if (prefix2 >= 40 && prefix2 <= 44) {
    const isMumbaiPune = prefix2 === 40 || prefix2 === 41;
    return {
      charge: isMumbaiPune ? 40 : 50,
      zone: "Local / Intra-State",
      state: prefix2 === 40 && prefix3 <= 403 ? "Goa / Konkan" : "Maharashtra",
      days: isMumbaiPune ? "1-2 Business Days" : "2-3 Business Days",
      isEstimated: false,
    };
  }

  // 3. North & West Metro Zones (Delhi NCR, Gujarat, Rajasthan, MP)
  if (
    prefix2 === 11 || prefix2 === 12 || prefix2 === 13 || // Delhi, Gurgaon, Haryana
    (prefix2 >= 30 && prefix2 <= 34) || // Rajasthan
    (prefix2 >= 36 && prefix2 <= 39) || // Gujarat
    (prefix2 >= 45 && prefix2 <= 49) // Madhya Pradesh & Chhattisgarh
  ) {
    return {
      charge: 65,
      zone: "North-West Zone",
      state: prefix2 === 11 ? "Delhi NCR" : prefix2 >= 36 ? "Gujarat" : prefix2 >= 30 ? "Rajasthan" : "North Region",
      days: "3-4 Business Days",
      isEstimated: false,
    };
  }

  // 4. South Region (Karnataka, Tamil Nadu, Telangana, AP, Kerala)
  if (prefix2 >= 50 && prefix2 <= 69) {
    const isSouthMetro = prefix2 === 56 || prefix2 === 60 || prefix2 === 50; // Bangalore, Chennai, Hyderabad
    return {
      charge: isSouthMetro ? 70 : 80,
      zone: "South Zone",
      state: prefix2 === 56 ? "Bangalore (Karnataka)" : prefix2 === 60 ? "Chennai (Tamil Nadu)" : prefix2 === 50 ? "Hyderabad (Telangana)" : "South India",
      days: "3-5 Business Days",
      isEstimated: false,
    };
  }

  // 5. East & Central (West Bengal, Bihar, Jharkhand, Odisha, UP, Uttarakhand)
  if (
    (prefix2 >= 70 && prefix2 <= 74) || // West Bengal / Kolkata
    (prefix2 >= 75 && prefix2 <= 77) || // Odisha
    (prefix2 >= 80 && prefix2 <= 85) || // Bihar, Jharkhand
    (prefix2 >= 20 && prefix2 <= 28) // UP, Uttarakhand
  ) {
    return {
      charge: 75,
      zone: "East / Central Zone",
      state: prefix2 === 70 ? "Kolkata (WB)" : prefix2 >= 20 && prefix2 <= 28 ? "Uttar Pradesh" : "East Region",
      days: "4-5 Business Days",
      isEstimated: false,
    };
  }

  // Fallback Standard Rate
  return {
    charge: 65,
    zone: "Standard Domestic",
    state: "Domestic",
    days: "4-5 Business Days",
    isEstimated: false,
  };
}
