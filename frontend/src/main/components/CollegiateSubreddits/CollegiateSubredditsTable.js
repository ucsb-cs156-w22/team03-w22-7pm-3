import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/CollegiateSubredditsUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function CollegiateSubredditsTable({ subreddits, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/collegiatesubreddits/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/collegiatesubreddits/all"]
    );
    // Stryker enable all 

    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'name',
            accessor: 'name',
        },
        {
            Header: 'location',
            accessor: 'location',
        },
        {
            Header: 'subreddit',
            accessor: 'subreddit',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "CollegiateSubredditsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CollegiateSubredditsTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => subreddits, [subreddits]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"CollegiateSubredditsTable"}
    />;
};
