// Resend REST API üzerinden e-posta gönderimi (npm paketi gerektirmez).
// RESEND_API_KEY + EMAIL_FROM yoksa no-op olur (dev/local'i bozmaz).

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn(`[email] yapılandırılmamış — atlandı: ${args.to} · ${args.subject}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: args.to,
        subject: args.subject,
        html: args.html,
      }),
    });
    if (!res.ok) {
      console.error(`[email] gönderilemedi ${res.status}: ${await res.text().catch(() => "")}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] hata", e);
    return false;
  }
}

// Basit, markalı HTML şablonu sarmalayıcı.
function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="tr"><body style="margin:0;background:#f4f2eb;font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px">
    <div style="font-weight:800;font-size:20px;letter-spacing:-.5px;margin-bottom:20px">Eagle&nbsp;Menu</div>
    <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid rgba(0,0,0,.08)">
      <h1 style="margin:0 0 12px;font-size:19px">${title}</h1>
      ${bodyHtml}
    </div>
    <p style="color:#9a948a;font-size:12px;margin-top:20px;text-align:center">
      Bu e-postayı beklemiyorsanız dikkate almayın.
    </p>
  </div></body></html>`;
}

export function renderPasswordResetEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Şifre sıfırlama isteği — Eagle Menu",
    html: layout(
      "Şifreni sıfırla",
      `<p style="margin:0 0 18px;line-height:1.6;color:#4a4a4a;font-size:14px">
         Hesabının şifresini sıfırlamak için aşağıdaki butona tıkla. Bağlantı <strong>1 saat</strong> geçerlidir.
       </p>
       <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px">Şifremi Sıfırla</a>
       <p style="margin:18px 0 0;line-height:1.6;color:#9a948a;font-size:12px">
         Buton çalışmazsa bu bağlantıyı tarayıcına yapıştır:<br>${resetUrl}
       </p>`,
    ),
  };
}
