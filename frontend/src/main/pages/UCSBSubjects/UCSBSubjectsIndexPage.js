import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser } from 'main/utils/currentUser'
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';

export default function UCSBSubjectsIndexPage() {

  const currentUser = useCurrentUser();

  const { data: students, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsbsubjects/all"],
      { method: "GET", url: "/api/ucsbsubjects/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>UCSBSubjects</h1>
        <UCSBSubjectsTable ucsbsubjects={ucsbsubjects} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}