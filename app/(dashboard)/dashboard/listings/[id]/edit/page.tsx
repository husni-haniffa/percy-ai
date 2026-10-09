import { EditListing } from "@/components/listings/listing-form/edit-listing";


export const metadata = { title: "Edit listing | Percy AI" };

export default async function EditListingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditListing id={id} />;
}