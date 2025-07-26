// In Backend/Controllers/SmsController.js

const twilio = require("twilio");

// Use environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // Add this to your .env

const client = twilio(accountSid, authToken);

exports.sendSms = async (req, res) => {
  const { phoneNumber, bloodGroup, confidence, timestamp } = req.body;
  // Debug: log incoming request
  console.log("[SMS DEBUG] Incoming sendSms request:", req.body);

  if (!phoneNumber || !bloodGroup) {
    console.error("[SMS DEBUG] Missing phone number or blood group");
    return res
      .status(400)
      .json({ error: "Missing phone number or blood group" });
  }

  const message = `Your blood group prediction: ${bloodGroup}\nConfidence: ${confidence}%\nTime: ${timestamp}`;

  try {
    const msgOptions = {
      body: message,
      to: phoneNumber.startsWith("+") ? phoneNumber : `+88${phoneNumber}`,
    };
    if (messagingServiceSid) {
      msgOptions.messagingServiceSid = messagingServiceSid;
    } else {
      msgOptions.from = fromNumber;
    }
    // Debug: log Twilio options
    console.log("[SMS DEBUG] Twilio msgOptions:", msgOptions);

    const twilioResponse = await client.messages.create(msgOptions);

    // Debug: log Twilio response
    console.log("[SMS DEBUG] Twilio SMS sent:", twilioResponse);

    res.json({
      success: true,
      twilioStatus: twilioResponse.status,
      sid: twilioResponse.sid,
    });
  } catch (err) {
    // Debug: log Twilio error
    console.error("[SMS DEBUG] Twilio SMS error:", err);

    if (
      err.message &&
      (err.message.includes("unverified") ||
        err.message.includes("verified caller IDs"))
    ) {
      return res.status(500).json({
        error:
          "Phone number is not a Verified Caller ID in your Twilio trial account.",
        twilioError: err.message,
      });
    }
    res.status(500).json({
      error: "Failed to send SMS",
      twilioError: err.message || err,
    });
  }
};
