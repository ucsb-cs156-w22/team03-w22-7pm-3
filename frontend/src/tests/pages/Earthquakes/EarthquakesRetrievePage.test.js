import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import EarthquakesRetrievePage from "main/pages/Earthquakes/EarthquakesRetrievePage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { earthquakesFixtures } from "fixtures/earthquakesFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("EarthquakesRetrievePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing for regular user", () => {
        //setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/earthquakes/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EarthquakesRetrievePage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const earthquake = {
            distance: "0.1",
            minMag: "0.5"
        };

        axiosMock.onGet("/api/earthquakes/retrieve").reply( 202,  earthquake);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EarthquakesRetrievePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("EarthquakesForm-distance")).toBeInTheDocument();
        });

        const distanceField = getByTestId("EarthquakesForm-distance");
        const minMagField = getByTestId("EarthquakesForm-minMag");
        const retrieveButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.change(distanceField, { target: { value: '0.1' } });
        fireEvent.change(minMagField, { target: { value: '0.5' } });

        expect(retrieveButton).toBeInTheDocument();

        fireEvent.click(retrieveButton);

        await waitFor(() => expect(axiosMock.history.get.length).toBe(3));

        expect(axiosMock.history.get[2].params).toEqual(
            {
            "distance": "0.1",
            "minMag": "0.5"
        });

        expect(mockToast).toBeCalledWith("0 Earthquakes retrieved");
        expect(mockNavigate).toBeCalledWith({ "to": "/earthquakes/list" });
    });

    // test("test what happens when you click delete, admin", async () => {
    //     setupAdminUser();

    //     const queryClient = new QueryClient();
    //     axiosMock.onGet("/api/ucsbsubjects/all").reply(200, ucsbSubjectsFixtures.threeSubjects);
    //     axiosMock.onDelete("/api/ucsbsubjects").reply(200, "UCSBSubject with id 1 was deleted");


    //     const { getByTestId } = render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <UCSBSubjectsIndexPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

    //    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); 


    //     const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    //     expect(deleteButton).toBeInTheDocument();
       
    //     fireEvent.click(deleteButton);

    //     await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBSubject with id 1 was deleted") });

    // });

});