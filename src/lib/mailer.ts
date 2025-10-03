import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <div style="background-color: #373469; color: white; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 22px;">Verifikasi OTP Kupi</h1>
          </div>
          
          <div style="padding: 30px; text-align: center; color: #333;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hai, berikut adalah kode OTP untuk verifikasi akunmu:
            </p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #FFB703; margin-bottom: 20px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #555;">
              Kode ini berlaku selama <strong>5 menit</strong>.  
              Jangan bagikan kode ini ke siapa pun.
            </p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Kupi. Semua Hak Dilindungi.
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Kupi App" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: "Kode OTP Verifikasi Akun Kupi",
      html: htmlContent,
    });

    console.log("Email terkirim:", info.messageId);
    return true;
  } catch (err) {
    console.error("Gagal kirim email OTP:", err);
    return false;
  }
}
