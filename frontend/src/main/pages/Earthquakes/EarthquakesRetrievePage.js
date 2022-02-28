import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EarthquakesRetrievePage() {
    let { id } = useParams();

    // const { data: Earthquakes, error: error, status: status } =
    //   useBackend(
    //     // Stryker disable next-line all : don't test internal caching of React Query
    //     [`/api/earthquakes/all`],
    //     {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
    //       method: "GET",
    //       url: `/api/earthquakes/retrieve`,
    //       params: {
    //         distance: Earthquakes.distance,
    //         minMag: Earthquakes.minMag
    //       }
    //     }
    //   );
  
  
    const objectToAxiosPutParams = (Earthquakes) => ({
      url: "/api/earthquakes/retrieve",
      method: "GET",
      params: {
        distance: Earthquakes.distance,
        minMag: Earthquakes.minMag
      },
    });
  
    const onSuccess = (Earthquakes) => {
      toast(`${Earthquakes.metadata.count} Earthquakes retrieved`);
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
          <h1>Earthquakes Retrieved</h1>
          {
            <EarthquakesForm submitAction={onSubmit}/>
          }
        </div>
      </BasicLayout>
    )
}