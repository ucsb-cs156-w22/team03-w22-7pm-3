import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";


import StudentsIndexPage from "main/pages/Students/StudentsIndexPage";
import StudentsCreatePage from "main/pages/Students/StudentsCreatePage";

import CollegiateSubredditsIndexPage from "main/pages/CollegiateSubreddits/CollegiateSubredditsIndexPage";
import CollegiateSubredditsCreatePage from "main/pages/CollegiateSubreddits/CollegiateSubredditsCreatePage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import UCSBSubjectsIndexPage from "main/pages/UCSBSubjects/UCSBSubjectsIndexPage";
import UCSBSubjectsCreatePage from "main/pages/UCSBSubjects/UCSBSubjectsCreatePage";

import EarthquakesIndexPage from "main/pages/Earthquakes/EarthquakesIndexPage";
<<<<<<< HEAD
<<<<<<< HEAD
import EarthquakesRetrievePage from "main/pages/Earthquakes/EarthquakesRetrievePage";
=======
import EarthquakesCreatePage from "main/pages/Earthquakes/EarthquakesCreatePage";
>>>>>>> 7b21afd (finished writing code for earthquake menu and page placeholders, and the tests for these placeholders.)
=======
import EarthquakesRetrievePage from "main/pages/Earthquakes/EarthquakesRetrievePage";
>>>>>>> e087700 (Changed create to retrieve)

function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }


        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/students/list" element={<StudentsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/students/create" element={<StudentsCreatePage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }

        {
          //added by Thomas
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbsubjects/list" element={<UCSBSubjectsIndexPage />}/>
            </>
          )
        }
        {
          //added by Thomas
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbsubjects/create" element={<UCSBSubjectsCreatePage />}/>
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/earthquakes/list" element={<EarthquakesIndexPage />}/>
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
<<<<<<< HEAD
<<<<<<< HEAD
              <Route exact path="/earthquakes/retrieve" element={<EarthquakesRetrievePage />}/>
=======
              <Route exact path="/earthquakes/retrieve" element={<EarthquakesCreatePage />}/>
>>>>>>> 7b21afd (finished writing code for earthquake menu and page placeholders, and the tests for these placeholders.)
=======
              <Route exact path="/earthquakes/retrieve" element={<EarthquakesRetrievePage />}/>
>>>>>>> e087700 (Changed create to retrieve)
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/collegiatesubreddits/list" element={<CollegiateSubredditsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/collegiatesubreddits/create" element={<CollegiateSubredditsCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/earthquakes/list" element={<EarthquakesIndexPage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
