// Relative Path: src\app\api\check-password\route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    console.log('Received password:', password);
    console.log('APP_PASSWORD:', process.env.APP_PASSWORD);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    if (process.env.APP_PASSWORD === undefined) {
      console.error('APP_PASSWORD is undefined');
      return NextResponse.json({ success: false, message: 'Server configuration error: APP_PASSWORD is not set' });
    }

    if (password === process.env.APP_PASSWORD) {
      console.log('Password match successful');
      return NextResponse.json({ success: true, message: 'Password correct' });
    } else {
      console.log('Password match failed');
      return NextResponse.json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error in check-password route:', error);
    return NextResponse.json({ success: false, message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) });
  }
}