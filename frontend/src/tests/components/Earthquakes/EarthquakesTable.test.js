import { fireEvent, render, waitFor } from "@testing-library/react";

import EarthquakesTable from "main/components/Earthquakes/EarthquakesTable";
import { earthquakesFixtures } from 'fixtures/earthquakesFixtures';
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


describe("EarthquakesTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={earthquakesFixtures.threeEarthquakes} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Title", "Mag", "Place", "Time"];
    const expectedFields = ["id", "title", "mag", "place", "time"];
    const testId = "EarthquakesTable";

    expectedHeaders.forEach( (headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    } );

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("abcd1234abcd1234abcd1234abcd1234");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("abcd1234abcd1234abcd1234abcd1234");
    expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("M 2.2 - 10km ESE of Ojai, CA");
    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("M 2.2 - 10km ESE of Ojai, CA");

  });

});

