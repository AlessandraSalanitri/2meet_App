import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("./serviceAccountKey.json")),
  });
}

export async function middleware(req) {
  const token = req.cookies.get("token");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const isAdmin = decodedToken.isAdmin;

    // Redirect if unauthorized
    if (req.nextUrl.pathname.startsWith("/admindashboard") && !isAdmin) {
      return NextResponse.redirect(new URL("/userdashboard", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/userdashboard") && isAdmin) {
      return NextResponse.redirect(new URL("/admindashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}