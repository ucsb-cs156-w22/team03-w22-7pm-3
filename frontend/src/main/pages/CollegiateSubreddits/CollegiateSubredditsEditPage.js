import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CollegiateSubredditForm from "main/components/CollegiateSubreddits/CollegiateSubredditForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CollegiateSubredditsEditPage() {
  let { id } = useParams();

  const { data: subreddit, error: error, status: status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/collegiatesubreddits?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/collegiatesubreddits`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (subreddit) => ({
    url: "/api/collegiatesubreddits",
    method: "PUT",
    params: {
      id: subreddit.id,
    },
    data: {
      name: subreddit.name,
      location: subreddit.location,
      subreddit: subreddit.subreddit
    }
  });

  const onSuccess = (subreddit) => {
    toast(`CollegiateSubreddit Updated - id: ${subreddit.id} name: ${subreddit.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/collegiatesubreddits?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/collegiatesubreddits/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-3">
        <h1>Edit CollegiateSubreddit</h1>
        {subreddit &&
          <CollegiateSubredditForm initialCollegiateSubreddit={subreddit} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

