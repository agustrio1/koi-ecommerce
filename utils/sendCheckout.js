import {transporter} from "./email.js"
import { formatRupiah } from "./currency.js";

export const sendCheckoutEmail = async (tokenEmail, cart, discount, shippingFee, total) => {
  const cartItemsHtml = cart
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatRupiah(Number(item.product.price))}</td>
        </tr>
      `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Mohon Selesaikan Pesanan</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
        Terima kasih telah melakukan checkout. Mohon selesaikan pesanan Anda sekarang.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; color: #333;">Produk</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; color: #333;">Jumlah</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; color: #333;">Harga</th>
          </tr>
        </thead>
        <tbody>
          ${cartItemsHtml}
        </tbody>
      </table>
      <p style="font-size: 16px; color: #555; margin-top: 20px;">
        Diskon: ${discount > 0 ? formatRupiah(Number(discount)) : "Tidak ada"}
      </p>
      <p style="font-size: 16px; color: #555; margin-top: 10px;">
        Biaya Pengiriman: ${formatRupiah(Number(shippingFee))}
      </p>
      <p style="font-size: 16px; color: #555; margin-top: 10px;">
        Total: ${formatRupiah(Number(total))}
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: tokenEmail,
      subject: "Checkout Sedang Diproses",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
