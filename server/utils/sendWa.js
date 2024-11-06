const axios = require("axios");
const tokenAPI = "8dceb2f4-0df1-4d77-87bb-00a87b35b9aa";
async function sendOtpToWa(noTelp, otp) {
  const body = {
    chats_users_id: noTelp,
    chats_message_text: `Kode OTP anda adalah : ${otp}. Silakan gunakan untuk menyelesaikan login Anda.`,
    channel: "wa",
    company_uuid: tokenAPI,
    chats_bot_id: 976,
  };
  try {
    await axios.post("https://api.barantum.com/api/v1/send-message", body);
    console.log(`OTP sent to ${noTelp}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Could not send OTP. Please try again.");
  }
}

module.exports = { sendOtpToWa };
