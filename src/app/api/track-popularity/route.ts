import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itemId, itemType } = body;

        if (!itemId || !itemType) {
            return NextResponse.json({ error: 'Missing itemId or itemType' }, { status: 400 });
        }

        // Insert into popularity table
        const { error } = await supabase
            .from('popularity')
            .insert({
                item_id: itemId,
                item_type: itemType, // 'product' or 'category'
            });

        if (error) {
            console.error('Error tracking popularity:', error);
            return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Unexpected error in tracking:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
