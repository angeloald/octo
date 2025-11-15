import React from "react";

export default function IncorporationPage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight">
          Articles of Incorporation
        </h1>
        <p className="text-muted-foreground mt-1">
          MaplePay Articles of Incorporation
        </p>
      </div>
      <div className="flex-1 p-6 overflow-auto max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold mb-4">Articles of Incorporation</h1>
        <p className="text-lg font-semibold mb-8">
          Corporations Canada – Canada Business Corporations Act (CBCA)
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Name of Corporation</h2>
          <p className="mb-6">MaplePay Technologies Inc.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            2. The Province or Territory where the registered office is situated
          </h2>
          <p className="mb-6">Ontario</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            3. Minimum and Maximum Number of Directors
          </h2>
          <p className="mb-2">Minimum number of directors: 1</p>
          <p className="mb-6">Maximum number of directors: 10</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            4. Business Restrictions (if any)
          </h2>
          <p className="mb-4">
            The corporation may carry on any lawful business, including but not
            limited to:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
            <li>Provision of online payment processing services</li>
            <li>Domestic and international money transfer services</li>
            <li>Merchant acquiring and payment gateway services</li>
            <li>
              Financial technology consulting and infrastructure services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            5. Classes and any Maximum Number of Shares that the Corporation is
            Authorized to Issue
          </h2>
          <p className="mb-4">
            The corporation is authorized to issue an unlimited number of Class
            A common shares.
          </p>
          <p className="mb-2 font-semibold">
            Rights, privileges, restrictions and conditions:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
            <li>
              Each Class A common share entitles the holder to one (1) vote at
              all meetings of shareholders.
            </li>
            <li>
              Each Class A common share entitles the holder to receive dividends
              as and when declared by the board of directors.
            </li>
            <li>
              In the event of liquidation, dissolution or winding-up of the
              corporation, the holders of Class A common shares are entitled to
              receive the remaining property of the corporation, after payment
              of all liabilities.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            6. Restrictions on Transfer of Shares (if any)
          </h2>
          <p className="mb-6">
            No shares of the corporation may be transferred without the approval
            of the board of directors, to ensure compliance with applicable
            anti-money laundering, sanctions, and regulatory requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Other Provisions</h2>
          <div className="space-y-4 mb-6">
            <p>
              <strong>a)</strong> The directors may, without shareholder
              authorization, make, amend or repeal any by-laws that regulate the
              business and affairs of the corporation, subject to confirmation
              by the shareholders at the next meeting.
            </p>
            <p>
              <strong>b)</strong> The corporation shall maintain robust internal
              controls and compliance programs where required by applicable
              financial regulations, including but not limited to anti-money
              laundering (AML) and counter-terrorist financing (CTF) laws.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Incorporators</h2>
          <div className="space-y-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Incorporator 1:</h3>
              <p className="mb-1">
                <strong>Name:</strong> Sarah Ahmed
              </p>
              <p>
                <strong>Address:</strong> 120 King Street West, Suite 1500,
                Toronto, Ontario, M5H 1J9, Canada
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Incorporator 2:</h3>
              <p className="mb-1">
                <strong>Name:</strong> Daniel Chen
              </p>
              <p>
                <strong>Address:</strong> 210 6th Avenue SW, Calgary, Alberta,
                T2P 3Y7, Canada
              </p>
            </div>
          </div>
          <p className="mb-6">
            <strong>Signed on:</strong> 2025-11-10
          </p>
        </section>

        <p className="text-sm text-muted-foreground italic mt-8">
          This document is a mock Articles of Incorporation created for
          demonstration purposes only.
        </p>
      </div>
    </div>
  );
}
