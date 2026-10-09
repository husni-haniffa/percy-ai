import { LegalPage, List, P, Section } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata = { title: "Terms of Service | Percy AI" };

export default function TermsPage() {
    const email = (
        <a href={`mailto:${site.contactEmail}`} className="text-red-700 underline">
            {site.contactEmail}
        </a>
    );

    return (
        <LegalPage title="Terms of Service">
            <P>
                These terms are the agreement between you and {site.operatorName} (&ldquo;we&rdquo;)
                for using {site.name}. By creating an account or using the site you agree to them.
                If you do not agree, please do not use the service.
            </P>

            <Section title="1. Who can use Percy">
                <P>
                    You must be at least 18 years old and able to enter into a binding agreement.
                    You can browse without an account. You need an account to post listings.
                </P>
            </Section>

            <Section title="2. Your account">
                <P>
                    You must give accurate information and keep your sign-in details secure. You
                    are responsible for everything done through your account. Tell us at {email}
                    if you think someone else is using it.
                </P>
            </Section>

            <Section title="3. What Percy is, and is not">
                <P>
                    {site.name} is a platform that lets owners advertise properties and vehicles
                    and lets buyers contact them. <strong>We are not a party to any deal between
                        buyers and sellers.</strong> We do not own, inspect, sell, rent or guarantee
                    anything listed, and we cannot promise that a listing, a seller or a buyer is
                    genuine. Any agreement, payment or handover is entirely between the people
                    involved, and they are responsible for checking details, documents and
                    ownership.
                </P>
            </Section>

            <Section title="4. Posting listings">
                <P>When you post a listing, you promise that:</P>
                <List
                    items={[
                        "you own the item or have the right to sell or rent it,",
                        "the details, price and photos are accurate and not misleading,",
                        "you own the photos or have permission to use them,",
                        "your listing follows the law and these terms.",
                    ]}
                />
            </Section>

            <Section title="5. Not allowed">
                <List
                    items={[
                        "fake, fraudulent or misleading listings, or listings that ask for money upfront without a real item,",
                        "stolen property, vehicles without proper documents, or anything illegal to sell or rent,",
                        "listings that are discriminatory, offensive or contain content you have no right to share,",
                        "spam, duplicate listings, or using the service to collect other people's contact details,",
                        "trying to damage, overload, or gain unauthorised access to the service.",
                    ]}
                />
            </Section>

            <Section title="6. Review, expiry and removal">
                <P>
                    Every new listing and every edit is reviewed by us before it goes public. We
                    may approve, reject, or remove any listing, or suspend an account, at our
                    discretion, for example if a listing breaks these terms or is reported as a
                    scam. When we reject or remove a listing we will tell you why. A review is a
                    basic check, not a guarantee that a listing is accurate or safe.
                </P>
                <P>
                    Listings expire automatically (currently after {site.listingDays} days) and
                    stop being visible. Editing an approved listing sends it back for review, and
                    it is hidden until it is approved again.
                </P>
            </Section>

            <Section title="7. Your content">
                <P>
                    You keep ownership of what you post. You give {site.name} permission to store,
                    display and process your listing content, including photos, in order to run
                    the service. This includes using it to power search, such as AI search. This
                    permission ends when your content is deleted from our systems.
                </P>
                <P>
                    Your name, phone number and email address are shown to anyone who taps
                    &ldquo;Show contact details&rdquo; on your listings.
                </P>
            </Section>

            <Section title="8. AI search">
                <P>
                    AI search suggests listings based on what you describe. Results are automatic
                    and may be incomplete or not exactly what you asked for, for example they may
                    not respect a price or number you mention. Always check the listing itself.
                </P>
            </Section>

            <Section title="9. Plans and fees">
                <P>
                    {site.name} is currently free. The free plan allows up to{" "}
                    {site.freeListingLimit} active listings for a limited period. We may change
                    plan limits or introduce paid plans in the future, and we will tell users
                    before any charge applies.
                </P>
            </Section>

            <Section title="10. Staying safe">
                <P>
                    Meet in safe places, check documents, and never pay in advance for something
                    you have not seen in person. If you see a suspicious listing, report it to{" "}
                    {email}.
                </P>
            </Section>

            <Section title="11. Disclaimers and liability">
                <P>
                    The service is provided &ldquo;as is&rdquo;, without promises that it will
                    always be available or error free. To the extent the law allows, we are not
                    responsible for losses arising from dealings between users, from inaccurate
                    listings, or from the service being unavailable. Nothing in these terms
                    limits any rights you have that cannot be limited by law.
                </P>
            </Section>

            <Section title="12. Ending your use">
                <P>
                    You can stop using {site.name} at any time and ask us to delete your account.
                    We may suspend or close accounts that break these terms.
                </P>
            </Section>

            <Section title="13. Changes">
                <P>
                    We may update these terms. The date at the top shows when they last changed.
                    If you keep using the service after a change, you accept the new terms.
                </P>
            </Section>

            <Section title="14. Governing law">
                <P>
                    These terms are governed by the laws of Sri Lanka, and the courts of Sri Lanka
                    have jurisdiction over any dispute.
                </P>
            </Section>

            <Section title="15. Contact">
                <P>Questions about these terms? Email {email}.</P>
            </Section>
        </LegalPage>
    );
}