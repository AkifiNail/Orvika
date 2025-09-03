import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: Request) {
    try {
        // Parser le body de la requête
        const body = await req.json()
        
        // Vérifier que le nom est fourni
        if (!body.name || typeof body.name !== 'string') {
            return Response.json(
                { error: "Le nom de l'équipe est requis" }, 
                { status: 400 }
            )
        }

        // Créer l'organisation
        const organization = await auth.api.createOrganization({
            body: {
                name: body.name.trim(),
                slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                logo: body.logo || undefined,
                metadata: body.metadata || undefined,
            },
            headers: await headers(),
        })

        if (!organization) {
            return Response.json(
                { error: "Erreur lors de la création de l'équipe" }, 
                { status: 500 }
            )
        }

        return Response.json({
            success: true,
            organization: {
                id: organization.id,
                name: organization.name,
                slug: organization.slug,
                logo: organization.logo,
                createdAt: organization.createdAt
            }
        })

    } catch (error) {
        console.error("Erreur création équipe:", error)
        return Response.json(
            { error: "Erreur interne du serveur" }, 
            { status: 500 }
        )
    }
}