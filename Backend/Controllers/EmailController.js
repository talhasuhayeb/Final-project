const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPredictionEmail = async (req, res) => {
  try {
    const {
      email,
      name,
      bloodGroup,
      confidence,
      processingTime,
      imageQuality,
      timestamp,
    } = req.body;

    if (!email || !name || !bloodGroup) {
      return res.status(400).json({
        message: "Missing required fields: email, name, or bloodGroup",
        success: false,
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Blood Group Detection Results - From Bindu ",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif;background-color:#faf5ef">
  <div style="background:linear-gradient(135deg,#99b19c 0%,#6d2932 100%);padding:30px;border-radius:15px;text-align:center;margin-bottom:20px">
    <div style="display: inline-block; text-align: center;">
      <table style="margin: 0 auto;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align: middle; padding-right: 8px;">
            <img src="https://i.ibb.co/KjT9Lt5n/logo.png" alt="Bindu Logo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          </td>
          <td style="vertical-align: middle;">
            <h1 style="color: #faf5ef; margin: 0; font-size: 28px; font-weight: bold; white-space: nowrap;">
              Bindu Blood Detection Results
            </h1>
          </td>
        </tr>
      </table>
    </div>
    <p style="color:#faf5ef;margin:8px 0 0 0;font-size:16px">AI-Powered Blood Group Detection</p>
  </div>

  <div style="background-color:white;padding:30px;border-radius:15px;border:2px solid #99b19c">
    <h2 style="color:#6d2932;margin-bottom:20px;font-size:24px">
      Hello ${name}! 👋
    </h2>
    <p style="color:#6d2932;font-size:16px;line-height:1.6;margin-bottom:30px">
      Your fingerprint analysis has been completed successfully. Here are your detection results:
    </p>

    <div style="background:linear-gradient(135deg,#99b19c 0%,#d7d1c9 100%);padding:25px;border-radius:12px;margin-bottom:25px">
      <table style="width:100%;border-collapse:collapse">
        <tr style="border-bottom:2px solid #6d2932">
          <td style="padding:12px;font-weight:bold;color:#6d2932;font-size:18px">
            🩸Detected Blood Group:
          </td>
          <td style="padding:12px;text-align:right">
            <span style="background-color:#6d2932;color:#faf5ef;padding:8px 16px;border-radius:20px;font-weight:bold;font-size:18px">
              ${bloodGroup}
            </span>
          </td>
        </tr>
        <tr style="border-bottom:1px solid #6d2932">
          <td style="padding:12px;font-weight:bold;color:#6d2932">🎯 Confidence Score:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;color:#2d7d32;font-size:16px">${confidence}%</td>
        </tr>
        <tr style="border-bottom:1px solid #6d2932">
          <td style="padding:12px;font-weight:bold;color:#6d2932">⚡ Processing Time:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;color:#1565c0;font-size:16px">${processingTime} ms</td>
        </tr>
        <tr style="border-bottom:1px solid #6d2932">
          <td style="padding:12px;font-weight:bold;color:#6d2932">📊 Image Quality:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;color:#7b1fa2;font-size:16px">${imageQuality}/100</td>
        </tr>
        <tr>
          <td style="padding:12px;font-weight:bold;color:#6d2932">🕐 Timestamp:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;color:#99b19c;font-size:14px">${timestamp}</td>
        </tr>
      </table>
    </div>

    <div style="background-color:#f5f5f5;padding:20px;border-radius:10px;border-left:4px solid #6d2932;margin-bottom:20px">
      <h3 style="color:#6d2932;margin-top:0;font-size:18px">📋 Important Information:</h3>
      <ul style="color:#6d2932;font-size:14px;line-height:1.6;margin:0;padding-left:20px">
        <li>This result is based on AI analysis and should be used for informational purposes only</li>
        <li>Keep this information secure and confidential</li>
      </ul>
    </div>

    <div style="text-align:center;margin-top:30px">
      <p style="color:#99b19c;font-size:16px;margin-bottom:15px">Thank you for using Bindu 🙏</p>
      <div style="border-top:2px solid #d7d1c9;padding-top:20px;margin-top:20px">
        <p style="color:#99b19c;font-size:12px;margin:5px 0">This is an automated email from Bindu Blood Detection System</p>
        <p style="color:#99b19c;font-size:12px;margin:5px 0">Please do not reply to this email</p>
      </div>
    </div>
  </div>
</div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Prediction results email sent successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in sendPredictionEmail:", err);
    res.status(500).json({
      message: "Error sending prediction results email",
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  sendPredictionEmail,
};
