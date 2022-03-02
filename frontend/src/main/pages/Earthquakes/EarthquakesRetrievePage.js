import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EarthquakesRetrievePage() {

    const objectToAxiosPutParams = (Earthquakes) => ({
      url: "/api/earthquakes/retrieve",
      method: "POST",
      params: {
        distance: Earthquakes.distance,
        minMag: Earthquakes.minMag
      },
    });
  
    const onSuccess = (Earthquakes) => {
      toast(`${Earthquakes.length} Earthquakes retrieved`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/earthquakes/all`]
    );
  
    const { isSuccess } = mutation
  
    const onSubmit = async (data) => {
      mutation.mutate(data);
    }
  
    if (isSuccess) {
      return <Navigate to="/earthquakes/list" />
    }
  
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Retrieve Earthquakes</h1>
          {
            <EarthquakesForm submitAction={onSubmit}/>
          }
        </div>
      </BasicLayout>
    )
}