import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EarthquakeForm from "main/components/Earthquakes/EarthquakeForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EarthquakesRetrievePage() {

  const objectToAxiosParams = (distance, minMag) => ({   //this probably doesn't work........
    url: String.format("/api/earthquakes/retrieve?distance=%s&minMag=%s",distance,minMag),
    method: "POST",
  });

  const onSuccess = (ucsbSubject) => {
    toast(`${ucsbSubject.id} Earthquakes retrieved.`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/earthquakes/all"]
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
        <h1>Create New UCSBSubject</h1>
        <UCSBSubjectForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}