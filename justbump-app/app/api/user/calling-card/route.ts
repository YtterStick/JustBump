import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserFromRequest } from '../../../../lib/auth';

// GET User's own card with all rich data
export async function GET(req: Request) {
    try {
        const token = await getUserFromRequest(req);
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const userId = Number(token.userId);
        const card = await prisma.callingCard.findUnique({
            where: { user_id: userId },
            include: {
                social_links: true,
                bank_details: true,
                video_links: true,
                external_links: true,
                physical_cards: {
                    where: { status: { in: ['active', 'assigned'] }, deleted_at: null }
                }
            }
        });

        if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

        if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

        // Restriction check: must have at least one active physical card
        if (card.physical_cards.length === 0) {
            return NextResponse.json({ error: 'Activation required' }, { status: 403 });
        }

        // Build unified contacts array
        let additionalContacts = (card as any).contacts || [];
        // Migrate legacy contact_value if contacts array is empty
        if (additionalContacts.length === 0 && card.contact_value) {
            additionalContacts = [{ value: card.contact_value, action_type: 'both' }];
        }

        const response = {
            ...card,
            additional_contacts: additionalContacts,
            bios: (card as any).bios || [],
        };

        return NextResponse.json(response);
    } catch (err: any) {
        console.error('GET Error details:', err);
        return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
    }
}

// UPDATE User's own card with deep updates for collections
export async function PUT(req: Request) {
    try {
        const token = await getUserFromRequest(req);
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const body = await req.json();
        console.log('PUT Body:', JSON.stringify(body, null, 2));
        const {
            full_name, job_title, company, address, profile_image_url, cover_image_url,
            bio_label, bio_text,
            theme_primary_color, theme_secondary_color, theme_text_color, theme_background_color,
            theme_layout, theme_font, bios, additional_contacts,
            social_links, video_links, external_links, bank_details
        } = body;

        const userId = Number(token.userId);
        // Check activation first
        const activeCard = await prisma.physicalCard.findFirst({
            where: {
                calling_card: { user_id: userId },
                status: { in: ['active', 'assigned'] },
                deleted_at: null
            }
        });

        if (!activeCard) {
            return NextResponse.json({ error: 'Activation required to edit profile' }, { status: 403 });
        }

        const updated = await prisma.$transaction(async (tx) => {
            try {
                // 1. Update the main card record
                console.log('UPDATING MAIN CARD:', userId);
                const card = await tx.callingCard.update({
                    where: { user_id: userId },
                    data: {
                        full_name, job_title, company, address, profile_image_url, cover_image_url,
                        bio_label, bio_text,
                        contact_value: additional_contacts?.[0]?.value || null,
                        theme_primary_color, theme_secondary_color, theme_text_color, theme_background_color,
                        theme_layout, theme_font, bios,
                        contacts: additional_contacts ?? undefined
                    }
                });

                // Bank Details
                if (bank_details) {
                    console.log('SYNC BANK DETAILS:', bank_details.length);
                    await tx.bankDetail.deleteMany({ where: { calling_card_id: card.id } });
                    if (bank_details.length > 0) {
                        await tx.bankDetail.createMany({
                            data: bank_details.map((item: any) => ({
                                calling_card_id: card.id,
                                provider: item.provider || '',
                                account_name: item.account_name || '',
                                account_number: item.account_number || '',
                                branch_code: item.branch_code || null,
                                display_order: item.display_order || 0
                            }))
                        });
                    }
                }

                // Social Links
                if (social_links) {
                    console.log('SYNC SOCIAL:', social_links.length);
                    await tx.socialLink.deleteMany({ where: { calling_card_id: card.id } });
                    if (social_links.length > 0) {
                        await tx.socialLink.createMany({
                            data: social_links.map((link: any) => ({
                                calling_card_id: card.id,
                                platform: link.platform || '',
                                url: link.url || '',
                                handle: link.handle || null,
                                display_order: link.display_order || 0
                            }))
                        });
                    }
                }

                // Video Links
                if (video_links) {
                    console.log('SYNC VIDEO:', video_links.length);
                    await tx.videoLink.deleteMany({ where: { calling_card_id: card.id } });
                    if (video_links.length > 0) {
                        await tx.videoLink.createMany({
                            data: video_links.map((link: any) => ({
                                calling_card_id: card.id,
                                title: link.title || null,
                                url: link.url || '',
                                thumbnail_url: link.thumbnail_url || null,
                                description: link.description || null,
                                display_order: link.display_order || 0
                            }))
                        });
                    }
                }



                // External Links
                if (external_links) {
                    console.log('SYNC EXTERNAL:', external_links.length);
                    await tx.externalLink.deleteMany({ where: { calling_card_id: card.id } });
                    if (external_links.length > 0) {
                        await tx.externalLink.createMany({
                            data: external_links.map((link: any) => ({
                                calling_card_id: card.id,
                                label: link.label || '',
                                url: link.url || '',
                                display_order: link.display_order || 0
                            }))
                        });
                    }
                }

                return await tx.callingCard.findUnique({
                    where: { id: card.id },
                    include: {
                        social_links: true,
                        video_links: true,
                        external_links: true,
                        bank_details: true,
                        physical_cards: true
                    }
                });
            } catch (t_err: any) {
                console.error('TRANSACTION STEP FAILED:', t_err);
                throw t_err; // Rethrow to roll back the whole transaction
            }
        });

        // Map JSON fields back to frontend-expected names
        const response = {
            ...updated,
            additional_contacts: (updated as any)?.contacts || [],
            bios: (updated as any)?.bios || [],
        };

        return NextResponse.json(response);
    } catch (err: any) {
        console.error('Update error details [500]:', err);
        return NextResponse.json({
            error: 'Server error',
            message: err.message,
            stack: err.stack, // Add stack for debugging
            details: JSON.stringify(err, Object.getOwnPropertyNames(err))
        }, { status: 500 });
    }
}
