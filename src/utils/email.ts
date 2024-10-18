import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingConfirmationEmail(booking: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.userEmail,
    subject: "Booking Confirmation",
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear user,</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <ul>
        <li>Booking ID: ${booking._id}</li>
        <li>From: ${booking.source.name}</li>
        <li>To: ${booking.destination.name}</li>
        <li>Start Time: ${new Date(booking.startTime).toLocaleString()}</li>
        <li>End Time: ${new Date(booking.endTime).toLocaleString()}</li>
        <li>Cab: ${booking.cab.name}</li>
        <li>Cost: $${booking.cost.toFixed(2)}</li>
      </ul>
      <p>Thank you for using our service!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
}
