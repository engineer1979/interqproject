// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type: "verification" | "reset_password" | "generic";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { to, subject, html, type }: EmailRequest = await req.json();

    let emailHtml = html;
    
    if (type === "verification") {
      emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
      <h1 style="color:white;font-size:28px;font-weight:700;margin:0;">Welcome to InterQ</h1>
      <p style="color:#e8edfe;font-size:16px;margin:10px 0 0 0;">Verify your email address</p>
    </div>
    <div style="padding:40px 30px;">
      <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 30px 0;">
        Hi there,
      </p>
      <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 30px 0;">
        Please click the button below to verify your email address and activate your InterQ account.
      </p>
      <a href="${html}" style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;font-weight:600;font-size:16px;padding:16px 32px;text-decoration:none;border-radius:8px;border:0;cursor:pointer;box-shadow:0 4px 14px 0 rgba(102,126,234,0.39);">
        Verify Email Address
      </a>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:30px 0 0 0;">
        Or copy and paste this link into your browser:<br>
        <a href="${html}" style="color:#3b82f6;">${html}</a>
      </p>
      <hr style="border:0;height:1px;background:#e5e7eb;margin:40px 0;">
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">
        If you did not create an account with InterQ, please ignore this email.
      </p>
    </div>
  </div>
</body>
</html>`;
    } else if (type === "reset_password") {
      emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center;">
      <h1 style="color:white;font-size:28px;font-weight:700;margin:0;">Reset Password</h1>
      <p style="color:#fef3c7;font-size:16px;margin:10px 0 0 0;">InterQ</p>
    </div>
    <div style="padding:40px 30px;">
      <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 30px 0;">
        You recently requested to reset your password. Click below to set a new one:
      </p>
      <a href="${html}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:white;font-weight:600;font-size:16px;padding:16px 32px;text-decoration:none;border-radius:8px;border:0;cursor:pointer;box-shadow:0 4px 14px 0 rgba(245,158,11,0.39);">
        Reset Password
      </a>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:30px 0 0 0;">
        Or copy and paste this link into your browser:<br>
        <a href="${html}" style="color:#f59e0b;">${html}</a>
      </p>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:30px 0 0 0;">
        This link expires in 60 minutes.
      </p>
      <hr style="border:0;height:1px;background:#e5e7eb;margin:40px 0;">
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">
        If you did not request a password reset, please ignore this email.
      </p>
    </div>
  </div>
</body>
</html>`;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "InterQ <onboarding@resend.dev>",
        to: to,
        subject: subject,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

