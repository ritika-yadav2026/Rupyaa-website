"use client";

import Image from "next/image";
import { ReactNode, useMemo, useState } from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";

type EscalationLevel = {
  readonly id: "level-1" | "level-2" | "level-3" | "level-4";
  readonly tabLabel: string;
  readonly tabSubLabel: string;
  readonly content: ReactNode;
};

function ContactCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
      {children}
    </div>
  );
}

function ContactLine({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <p className="text-sm sm:text-base">
      <strong className="text-gray-800">{label}</strong> {children}
    </p>
  );
}

function EscalationFlowchart() {
  return (
    <div className="pt-6 sm:pt-8 border-t border-gray-100">
      <Image
        src="/images/grievance-escalation-flowchart.png"
        alt="Grievance escalation flowchart showing contact, escalation, and resolution steps"
        width={800}
        height={1200}
        className="w-full max-w-md mx-auto h-auto"
        priority
      />
    </div>
  );
}

function getActiveLevelIndex(params: {
  activeLevelId: EscalationLevel["id"];
  levels: readonly EscalationLevel[];
}): number {
  const activeIndex: number = params.levels.findIndex(
    (level) => level.id === params.activeLevelId,
  );
  return activeIndex >= 0 ? activeIndex : 0;
}

export default function GrievanceRedressalMechanismPage() {
  const levels: readonly EscalationLevel[] = useMemo(
    () => [
      {
        id: "level-1",
        tabLabel: "Level 1",
        tabSubLabel: "Customer Relationship Manager",
        content: (
          <div className="space-y-4 sm:space-y-5">
            <p>
              Customers who wish to send in complaint/feedback over any issue
              can use the following channels.
            </p>
            <p>Please contact Customer Relationship Manager.</p>
            <ContactCard>
              <ContactLine label="Email ID:">
                <a href="mailto:grievance@zapcash.in" className="break-all">
                  grievance@zapcash.in
                </a>
              </ContactLine>
              <ContactLine label="Timings:">
                10 am to 6 pm on week days
              </ContactLine>
            </ContactCard>
          </div>
        ),
      },
      {
        id: "level-2",
        tabLabel: "Level 2",
        tabSubLabel: "Customer Service Help Desk",
        content: (
          <div className="space-y-4 sm:space-y-5">
            <p>
              If you are not satisfied with the response received from the
              branch or if you don&apos;t receive a response in 3 working days,
              please call our Help Desk Representatives available on the phone
              to register your complaints.
            </p>
            <ContactCard>
              <ContactLine label="Helpline No.:">
                <a href="tel:+918503090309">85-0309-0309</a>
              </ContactLine>
              <ContactLine label="Email ID:">
                <a href="mailto:care@zapcash.in" className="break-all">
                  care@zapcash.in
                </a>
              </ContactLine>
              <ContactLine label="Timings:">
                10 am to 6 pm on week days
              </ContactLine>
            </ContactCard>
          </div>
        ),
      },
      {
        id: "level-3",
        tabLabel: "Level 3",
        tabSubLabel: "Grievance Redressal Officer",
        content: (
          <div className="space-y-4 sm:space-y-5">
            <p>
              If you are not satisfied with the response from customer service
              helpdesk or if you don&apos;t receive a response within 3 working
              days, please call or write to the Grievance Redressal Officer. You
              will receive a response within 5 working days of the Grievance
              Redressal Officer receiving the complaint.
            </p>
            <ContactCard>
              <p className="text-sm sm:text-base">
                <strong className="text-gray-800">
                  Grievance Redressal Officer (Nodal Officer)
                </strong>
              </p>
              <ContactLine label="Name:">Prashant Kabra</ContactLine>
              <ContactLine label="Address:">
              79, Ground Floor, World Trade Centre, Babar Lane, New Delhi - 110001, India
              </ContactLine>
              <ContactLine label="Contact No.:">
                <a href="tel:+917665466546">7665466546</a>
              </ContactLine>
              <ContactLine label="Email:">
                <a href="mailto:pno@weekline.in" className="break-all">
                  pno@weekline.in
                </a>
              </ContactLine>
            </ContactCard>
          </div>
        ),
      },
      {
        id: "level-4",
        tabLabel: "Level 4",
        tabSubLabel: "Escalation to RBI",
        content: (
          <div className="space-y-4 sm:space-y-5">
            <p>
              Also, if the complaint / dispute is not redressed within a period
              of one month, the customer may appeal to the RBI on the following
              addresses:
            </p>
            <ContactCard>
              <p className="text-sm sm:text-base">
                <strong className="text-gray-800">The General Manager</strong>
              </p>
              <p className="text-sm sm:text-base">
                Deptt. of Non-Banking Supervision (DNBS)
              </p>
              <p className="text-sm sm:text-base">Reserve Bank of India</p>
              <p className="text-sm sm:text-base">
                6, Sansad Marg, New Delhi - 110001
              </p>
              <ContactLine label="Email:">
                <a href="mailto:dnbsnewdelhi@rbi.org.in" className="break-all">
                  dnbsnewdelhi@rbi.org.in
                </a>
              </ContactLine>
              <ContactLine label="Online:">
                <a
                  href="https://cms.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all"
                >
                  https://cms.rbi.org.in
                </a>
              </ContactLine>
              <ContactLine label="Email:">
                <a href="mailto:crpc@rbi.org.in" className="break-all">
                  crpc@rbi.org.in
                </a>
              </ContactLine>
              <ContactLine label="Toll-Free Number:">
                <a href="tel:14448">14448</a>
              </ContactLine>
            </ContactCard>
          </div>
        ),
      },
    ],
    [],
  );

  const [activeLevelId, setActiveLevelId] =
    useState<EscalationLevel["id"]>("level-1");
  const activeLevelIndex: number = getActiveLevelIndex({
    activeLevelId,
    levels,
  });
  const activeLevel: EscalationLevel = levels[activeLevelIndex] ?? levels[0];

  return (
    <PolicyPageLayout
      title="GRIEVANCE REDRESSAL MECHANISM"
      effectiveDate="February 25, 2026"
    >
      <div className="space-y-2 sm:space-y-2">
        <div className="bg-gray-50 border border-gray-100 rounded-xl ">
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3"
            role="tablist"
          >
            {levels.map((level) => {
              const isActive: boolean = level.id === activeLevelId;
              return (
                <button
                  key={level.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveLevelId(level.id)}
                  className={[
                    "rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-left border transition-colors",
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-100",
                  ].join(" ")}
                >
                  <div className="text-sm sm:text-base font-semibold">
                    {level.tabLabel}
                  </div>
                  <div
                    className={[
                      "text-xs sm:text-sm mt-1 leading-snug",
                      isActive ? "text-white/80" : "text-gray-500",
                    ].join(" ")}
                  >
                    {level.tabSubLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="pt-1" role="tabpanel">
          {activeLevel.content}
          <EscalationFlowchart />
        </div>
      </div>
    </PolicyPageLayout>
  );
}
