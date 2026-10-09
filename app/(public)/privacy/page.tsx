import { LegalPage, List, P, Section } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata = { title: "Privacy Policy | Percy AI" };

export default function PrivacyPage() {
    const email = (
        <a href={`mailto:${site.contactEmail}`} className="text-red-700 underline">
            {site.contactEmail}
        </a>
    );

    return (
        <LegalPage title="Privacy Policy">
            <P>
                This policy explains what personal information {site.name} collects, why we
                collect it, who we share it with, and the choices you have. We have tried to
                keep it short and in plain language.
            </P>

            <Section title="1. Who we are">
                <P>
                    {site.name} is an online marketplace where people in Sri Lanka list
                    properties and vehicles for sale or rent. It is run by {site.operatorName} (
                    {site.location}). You can contact us at {email}.
                </P>
            </Section>

            <Section title="2. What we collect">
                <List
                    items={[
                        <>
                            <strong>Account details:</strong> your name and email address, provided
                            through our sign-in service when you create an account.
                        </>,
                        <>
                            <strong>Phone number:</strong> which you give us when you set up your
                            account, so that buyers can contact you.
                        </>,
                        <>
                            <strong>Listing content:</strong> the titles, descriptions, prices,
                            locations, specifications and photos you add to your listings.
                        </>,
                        <>
                            <strong>Activity totals:</strong> how many times each listing was viewed,
                            how many people revealed its contact details, and how many used a contact
                            button. These are totals shown to the listing owner, not a record of who
                            did it.
                        </>,
                        <>
                            <strong>Search text:</strong> the words you type into AI search. We do not
                            save them to our database.
                        </>,
                        <>
                            <strong>Technical data:</strong> basic information such as your IP address
                            and browser type, which our hosting and security tools handle to keep the
                            site running and to protect it from abuse.
                        </>,
                    ]}
                />
                <P>
                    You can browse {site.name} without an account. In that case we only handle the
                    technical data above.
                </P>
            </Section>

            <Section title="3. How we use it">
                <List
                    items={[
                        "To run the marketplace: showing listings and letting buyers contact owners.",
                        "To review listings before they go live, and to remove listings that break our rules.",
                        "To power AI search, which finds listings that match what a visitor describes.",
                        "To prevent fraud, spam and abuse, and to keep the service secure.",
                        "To answer your messages and to meet our legal obligations.",
                    ]}
                />
            </Section>

            <Section title="4. What is public">
                <P>
                    Once a listing is approved, its content (including photos, price and
                    location) can be seen by anyone. When a visitor taps &ldquo;Show contact
                    details&rdquo; on your listing, they see your <strong>name, phone number and
                        email address</strong>. No sign-in is needed to do this. Only post a listing
                    if you are comfortable with that.
                </P>
            </Section>

            <Section title="5. Who we share it with">
                <P>We do not sell your personal information. We use trusted service providers who process data only to provide their services to us:</P>
                <List
                    items={[
                        <>
                            <strong>Clerk:</strong> sign-in and account management.
                        </>,
                        <>
                            <strong>MongoDB Atlas:</strong> our database.
                        </>,
                        <>
                            <strong>Cloudflare:</strong> storage for listing photos.
                        </>,
                        <>
                            <strong>OpenAI:</strong> AI search. The text of listings and the text of
                            search queries is sent to OpenAI so it can be turned into numbers that
                            allow similar meanings to be matched.
                        </>,
                        <>
                            <strong>Hosting providers:</strong> the services that run our website and
                            server.
                        </>,
                    ]}
                />
                <P>
                    We may also disclose information if the law requires it, or to protect users
                    from fraud or harm.
                </P>
            </Section>

            <Section title="6. Transfers outside Sri Lanka">
                <P>
                    Our service providers may store and process information on servers outside
                    Sri Lanka. By using {site.name} you understand that your information may be
                    transferred to and processed in other countries. We choose providers that
                    protect data with appropriate security measures.
                </P>
            </Section>

            <Section title="7. How long we keep it">
                <P>
                    We keep your account and listing information while your account is active.
                    When you delete a listing we hide it straight away, but records may remain in
                    our systems and backups for a limited time before they are erased. Expired
                    listings are hidden from the public but stay visible to you in your dashboard.
                    If you ask us to delete your account, we will erase your personal information
                    unless we must keep some of it by law or to prevent fraud.
                </P>
            </Section>

            <Section title="8. Your rights">
                <P>You can ask us to:</P>
                <List
                    items={[
                        "tell you what personal information we hold about you,",
                        "correct anything that is wrong,",
                        "delete your information and account,",
                        "stop using your information for a purpose you no longer agree with.",
                    ]}
                />
                <P>
                    Email {email} and we will aim to reply within 30 days. You may also have the
                    right to complain to the data protection authority in Sri Lanka.
                </P>
            </Section>

            <Section title="9. Cookies">
                <P>
                    We only use the cookies needed to keep you signed in and your account secure,
                    which are set by our sign-in provider. We do not currently use advertising or
                    tracking cookies. If that changes, we will update this page.
                </P>
            </Section>

            <Section title="10. Children">
                <P>
                    {site.name} is for people aged 18 and over. We do not knowingly collect
                    information from children.
                </P>
            </Section>

            <Section title="11. Security">
                <P>
                    We use reasonable measures to protect your information, including encrypted
                    connections and restricted access to our systems. No online service is
                    completely secure, so please also keep your own account safe.
                </P>
            </Section>

            <Section title="12. Changes to this policy">
                <P>
                    We may update this policy from time to time. The date at the top shows when it
                    last changed. If we make an important change, we will tell you on the site.
                </P>
            </Section>

            <Section title="13. Contact">
                <P>
                    Questions about your privacy? Email {email}.
                </P>
            </Section>
        </LegalPage>
    );
}