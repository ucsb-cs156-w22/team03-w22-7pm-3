import React from 'react';
import { useBackend, useBackendMutation } from 'main/utils/useBackend';
import EarthquakesTable from "main/components/Earthquakes/EarthquakesTable";
import { useCurrentUser } from 'main/utils/currentUser'
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {onPurgeSuccess,cellToAxiosParamsPurge} from "main/utils/EarthquakeUtils"


import { Button } from 'react-bootstrap';
import { toast } from "react-toastify";

function Purge()
{
  let purge = useBackendMutation(
    cellToAxiosParamsPurge,
    { onSuccess: onPurgeSuccess},
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/earthquakes/all"],
  );

  return (
    <Button variant="outline-danger" onClick={ () => { purge.mutate(); } } data-testid="purge-button">
      Purge
    </Button>
  );
}

export default function EarthquakesListPage() {

	const currentUser = useCurrentUser();
  
	const { data: earthquakes, error: _error, status: _status } =
	  useBackend(
		// Stryker disable next-line all : don't test internal caching of React Query
		["/api/earthquakes/all"],
		{ method: "GET", url: "/api/earthquakes/all" },
		[]
	  );
  
	return (
	  <BasicLayout>
		<div className="pt-2">
		  <h1>Earthquakes</h1>
		  <Purge/>
		  <EarthquakesTable earthquakes={earthquakes} currentUser={currentUser} />
		</div>
	  </BasicLayout>
	)
  }