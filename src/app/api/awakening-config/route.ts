import {NextResponse} from 'next/server';
import {writeConfig} from '@/lib/awakening';
export const dynamic='force-dynamic';
export function GET() {
  return NextResponse.json(writeConfig(process.env),{headers:{'Cache-Control':'no-store'}});
}
