const url = "https://script.google.com/macros/s/AKfycbyb6F87ujLEm6yqIB3Tgs8xETioPt6hOfhOt_Hi3yaQmvUcIgW25kz7CjR5ds29x_se1g/exec";

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "SystemTest",
    partner: "ConnectionVerified"
  })
}).then(async (res) => {
  console.log("Status:", res.status);
  console.log("Text:", await res.text());
}).catch(err => {
  console.error("Error:", err);
});
